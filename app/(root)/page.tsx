import React from 'react'
import HeaderBox from './../../components/HeaderBox';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import RightSideBar from '@/components/RightSideBar';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import RecentTransactions from '@/components/RecentTransactions';

export default async function Home({ searchParams: { id, page } }: SearchParamProps) {
  const currentPage = Number(page as string) || 1;
  const user = await getLoggedInUser();
  console.log('Home', user.$id);
  const accounts = await getAccounts({ userId: user?.$id });
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
            user={user?.firstName || 'Guest'}
            subtext={'Access and manage your account and transactions efficiently'}
          />

          <TotalBalanceBox 
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>
        <RecentTransactions
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>
      <RightSideBar 
        user={user}
        transactions={account?.transactions}
        banks={accountsData?.slice(0, 2)}
      />
    </section>
  )
}
