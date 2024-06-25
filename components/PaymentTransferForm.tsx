"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createTransfer } from "@/lib/actions/dwolla.actions";
import { getBank, getBankByAccountId } from "@/lib/actions/user.actions";
import { decryptId, transferFormSchema } from "@/lib/utils";
import { createTransaction } from "@/lib/actions/transaction.actions";

import { Button } from "./ui/button";
import {
  Form,
} from "./ui/form";
import CustomTransferForm from "./CustomTransferForm";

const formSchema = transferFormSchema;
const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            amount: "",
            senderBank: "",
            sharableId: "",
        },
    });

    const submit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            const receiverAccountId = decryptId(data.sharableId);
            const receiverBank = await getBankByAccountId({
                accountId: receiverAccountId,
            });
            const senderBank = await getBank({ documentId: data.senderBank });

            const transferParams = {
                sourceFundingSourceUrl: senderBank.fundingSourceUrl,
                destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
                amount: data.amount,
            };
            // create transfer
            const transfer = await createTransfer(transferParams);

            // create transfer transaction
            if (transfer) {
                const transaction = {
                    name: data.name,
                    amount: data.amount,
                    senderId: senderBank.userid.$id,
                    senderBankId: senderBank.$id,
                    receiverId: receiverBank.userid.$id,
                    receiverBankId: receiverBank.$id,
                    email: data.email,
                };

                const newTransaction = await createTransaction(transaction);

                if (newTransaction) {
                    form.reset();
                    router.push("/");
                }
            }
        } catch (error) {
            console.error("Submitting create transfer request failed: ", error);
        }

        setIsLoading(false);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
                <CustomTransferForm
                    control={form.control}
                    name={'senderBank'}
                    setValue={form.setValue}
                    label={'Select Source Bank'}
                    description={'Select the bank account you want to transfer funds from'}
                    placeholder={''}
                    accounts={accounts}
                    formType={'dropdown'}
                    extraItemStyle={'pb-6 pt-5'}
                    extraLabelStyle={''}
                />

                <CustomTransferForm
                    control={form.control}
                    name={'name'}
                    setValue={form.setValue}
                    label={'Transfer Note (Optional)'}
                    description={'Please provide any additional information or instructions related to the transfer'}
                    placeholder={'Write a short note here'}
                    accounts={[]}
                    formType={'textarea'}
                    extraItemStyle={'pb-6 pt-5'}
                    extraLabelStyle={''}
                />

                <div className="payment-transfer_form-details">
                <h2 className="text-18 font-semibold text-gray-900">
                    Bank account details
                </h2>
                <p className="text-16 font-normal text-gray-600">
                    Enter the bank account details of the recipient
                </p>
                </div>

                <CustomTransferForm
                    control={form.control}
                    name={'email'}
                    setValue={form.setValue}
                    label={"Recipient's Email Address"}
                    description={''}
                    placeholder={'eg: johndoe@gmail.com'}
                    accounts={[]}
                    formType={'input'}
                    extraItemStyle={'py-5'}
                    extraLabelStyle={'w-full max-w-[280px]'}
                />

                <CustomTransferForm
                    control={form.control}
                    name={'sharableId'}
                    setValue={form.setValue}
                    label={"Receiver's Plaid Sharable Id"}
                    description={''}
                    placeholder={'Enter the public account number'}
                    accounts={[]}
                    formType={'input'}
                    extraItemStyle={'pb-5 pt-6'}
                    extraLabelStyle={'w-full max-w-[280px]'}
                />

                <CustomTransferForm
                    control={form.control}
                    name={'amount'}
                    setValue={form.setValue}
                    label={'Amount'}
                    description={''}
                    placeholder={'eg: 5.00'}
                    accounts={[]}
                    formType={'input'}
                    extraItemStyle={'py-5'}
                    extraLabelStyle={'w-full max-w-[280px]'}
                />

                <div className="payment-transfer_btn-box">
                <Button type="submit" className="payment-transfer_btn">
                    {isLoading ? (
                    <>
                        <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
                    </>
                    ) : (
                    "Transfer Funds"
                    )}
                </Button>
                </div>
            </form>
        </Form>
    );
};

export default PaymentTransferForm;