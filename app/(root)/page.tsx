import React from 'react'
import HeaderBox from './../../components/HeaderBox';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import RightSideBar from '@/components/RightSideBar';
import { getLoggedInUser } from '@/lib/actions/user.actions';

export default async function Home() {
  const user = await getLoggedInUser();
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
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1021.35}
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
