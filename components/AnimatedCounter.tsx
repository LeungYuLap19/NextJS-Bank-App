'use client';
import CountUp from 'react-countup'

export default function AnimatedCounter(
    { amount } : { amount : number }) {
  return (
    <div className='w-full'>
        <CountUp 
            decimal={','}
            end={amount}
            prefix='$'
            decimals={2}
            duration={2}
        />
    </div>
  )
}
