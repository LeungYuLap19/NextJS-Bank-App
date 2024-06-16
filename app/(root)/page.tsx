import React from 'react'
import HeaderBox from './../../components/HeaderBox';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import RightSideBar from '@/components/RightSideBar';

export default function Home() {
  const loggedIn = {
    firstName: 'Jimmy',
    lastName: 'Leung',
    email: 'jimmy@example.com'
  };

  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox 
            type={'greeting'}
            title={'Welcome'}
            user={loggedIn? loggedIn.firstName : 'Guest'}
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
        user={loggedIn}
        transactions={[]}
        banks={[{ currentBalance: 132.80 }, { currentBalance: 892.90}]}
      />
    </section>
  )
}
