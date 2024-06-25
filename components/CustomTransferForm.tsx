import React from 'react'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { BankDropdown } from './BankDropdown'
import { Control } from 'react-hook-form'
import { z } from 'zod'


interface CustomTransferFormProps {
    control: Control<z.infer<typeof formSchema>>,
    name: FieldPath<z.infer<typeof formSchema>>,
}

export default function CustomTransferForm({ 
    control, name, label, description, accounts, setValue,
    formType
 }) {
    return (
        <FormField
            control={control}
            name={name}
            render={() => (
                <FormItem className="border-t border-gray-200">
                    <div className="payment-transfer_form-item pb-6 pt-5">
                        <div className="payment-transfer_form-content">
                        <FormLabel className="text-14 font-medium text-gray-700">
                            {label}
                        </FormLabel>
                        <FormDescription className="text-12 font-normal text-gray-600">
                            {description}
                        </FormDescription>
                        </div>
                        <div className="flex w-full flex-col">
                            <FormControl>
                                <BankDropdown
                                    accounts={accounts}
                                    setValue={setValue}
                                    otherStyles="!w-full"
                                />
                            </FormControl>
                            <FormMessage className="text-12 text-red-500" />
                        </div>
                    </div>
                </FormItem>
            )}
        />
    )
}
