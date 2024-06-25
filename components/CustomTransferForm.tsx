import React from 'react'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { BankDropdown } from './BankDropdown'
import { Control, FieldPath, UseFormSetValue } from 'react-hook-form'
import { z } from 'zod'
import { transferFormSchema } from '@/lib/utils'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'

const formSchema = transferFormSchema;
interface CustomTransferFormProps {
    control: Control<z.infer<typeof formSchema>>,
    name: FieldPath<z.infer<typeof formSchema>>,
    setValue: UseFormSetValue<z.infer<typeof formSchema>>,
    label: string,
    description: string,
    placeholder: string,
    accounts: Account[],
    formType: 'dropdown' | 'textarea' | 'input'
    extraItemStyle: string,
    extraLabelStyle: string,
}

export default function CustomTransferForm({ 
    control, name, label, description, accounts, setValue, placeholder, 
    formType, extraItemStyle, extraLabelStyle,
}: CustomTransferFormProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="border-t border-gray-200">
                    <div className={`payment-transfer_form-item ${extraItemStyle}`}>
                        <div className="payment-transfer_form-content">
                        <FormLabel className={`text-14 font-medium text-gray-700 ${extraLabelStyle}`}>
                            {label}
                        </FormLabel>
                        {
                            formType === 'dropdown' || formType === 'textarea' &&
                            <FormDescription className="text-12 font-normal text-gray-600">
                                {description}
                            </FormDescription>
                        }
                        </div>
                        <div className="flex w-full flex-col">
                            <FormControl>
                                {
                                    formType === 'dropdown' ?
                                    <BankDropdown
                                        accounts={accounts}
                                        setValue={setValue}
                                        otherStyles="!w-full"
                                    /> :
                                    formType === 'textarea' ?
                                    <Textarea
                                        placeholder={placeholder}
                                        className="input-class"
                                        {...field}
                                    /> :
                                    formType === 'input' &&
                                    <Input
                                        placeholder={placeholder}
                                        className="input-class"
                                        {...field}
                                    />
                                }
                            </FormControl>
                            <FormMessage className="text-12 text-red-500" />
                        </div>
                    </div>
                </FormItem>
            )}
        />
    )
}
