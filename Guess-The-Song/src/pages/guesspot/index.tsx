import React from 'react';
import Link from 'next/link';
import { FastForwardIcon, PlayIcon } from '@heroicons/react/solid';
import Sidebar from '../../components/Sidebar';

const Landing = () => {
  return (
    <main className='flex min-h-screen min-w-max bg-neutral-900 lg:pb-24'>
      <Sidebar />
      <div className='flex h-screen w-screen bg-neutral-900 items-center justify-center'>
        <div className='h-full w-1/2 p-32'>
          <h1 className='text-8xl font-bold text-green-600'>GUESSPOT</h1>
          <h2 className='text-7xl font-bold text-gray-200  py-8'>
            Guess the <br />
            song and the <br />
            artist
          </h2>
        </div>
        <Link href='/guesspot/game'>
          <FastForwardIcon className='w-[35rem] cursor-pointer text-gray-200' />
        </Link>
      </div>
    </main>
  );
};

export default Landing;
