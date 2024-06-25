import HeaderBox from '@/components/HeaderBox'
import PaymentTransferForm from '@/components/PaymentTransferForm'
import React from 'react'

export default function Transfer() {
  return (
    <section className='payment-transfer'>
      <HeaderBox 
        title={'Payment Transfer'} 
        subtext={'Please provide any specific details or notes related to the payment transfer'} 
      />
      <section className='size-full pt-5'>
        <PaymentTransferForm accounts={[]} />
      </section>
    </section>
  )
}
