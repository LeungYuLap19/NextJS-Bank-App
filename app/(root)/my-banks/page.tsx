import BankCard from '@/components/BankCard';
import HeaderBox from '@/components/HeaderBox'
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions'
import React from 'react'

export default async function MyBanks() {
  const user = await getLoggedInUser();
  console.log('MyBanks', user.$id);
  const accounts = await getAccounts({ userId: user?.$id });

  return (
    <section className='flex'>
      <div className='my-banks'>
        <HeaderBox title={'My Bank Accounts'} subtext={'Effortlessly manage your banking activities'} />

        <div className='space-y-4'>
          <h2 className='header-2'>Your Cards</h2>

          <div className='flex flex-wrap gap-6'>
            {
              accounts &&
              accounts.data.map((account: Account) => {
                return (
                  <BankCard 
                    key={account.id} 
                    account={account} 
                    userName={`${user?.firstName} ${user?.lastName}`} 
                  />
                )
              })
            }
          </div>
        </div>
      </div>
    </section>
  )
}
