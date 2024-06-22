import React from 'react'
import HeaderBox from './../../components/HeaderBox';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import RightSideBar from '@/components/RightSideBar';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';

export default async function Home({ searchParams: { id, page } }: SearchParamProps) {
  const user = await getLoggedInUser();
  const accounts = await getAccounts({ userId: user.$id });
  if(!accounts) return;

  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;
  const account = await getAccount({ appwriteItemId });
  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox 
            type={'greeting'}
            title={'Welcome'}
            user={user?.name || 'Guest'}
            subtext={'Access and manage your account and transactions efficiently'}
          />

          <TotalBalanceBox 
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>
        Recent transactions
      </div>
      <RightSideBar 
        user={user}
        transactions={[]}
        banks={[{ currentBalance: 132.80 }, { currentBalance: 892.90}]}
      />
    </section>
  )
}
