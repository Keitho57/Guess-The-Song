import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import SpotifyPlayer from 'react-spotify-web-playback';
import { spotifyApi } from '../../utils/spotify';

import ScoreBoardModal from '../../components/ScoreBoardModal';
import Sidebar from '../../components/Sidebar';

import { ArrowRightIcon, FastForwardIcon, XIcon } from '@heroicons/react/solid';
import { BiUndo } from 'react-icons/bi';
import getRandomSong from '../api/getRandomSong';
import Player from '../../components/Player';

const TIMER_LENGTH = 30;

const Game = () => {
  const [timer, setTimer] = useState(TIMER_LENGTH);
  const [song, setSong] = useState(null);
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(0);
  const [tracks, setTracks] = useState<any>();

  const { data: session } = useSession();
  const accessToken: any = session?.accessToken;
  console.log('session', session?.accessToken);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi
      .getMyRecentlyPlayedTracks({ limit: 50 })
      .then((res: { body: { items: { track: any }[] } }) => {
        setTracks(
          res.body.items.map(({ track }) => {
            return {
              id: track.id,
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumUrl: track.album.images[0].url,
            };
          })
        );
      });

    console.log('tracks', tracks);
  }, [accessToken, tracks]);

  const checkGuess = (e: any) => {
    e.preventDefault();
    if (song === null) return;

    if (guess === song) {
      setScore(score + 1);
      // return randomSong
    }
    setLives(lives + 1);
    setGuess('');
    checkLives();
  };

  const checkLives = () => {
    if (lives > 3) {
      return <ScoreBoardModal />;
    }
  };

  const gameStart = () => {
    // setSong(randomSong)
    setGuess('');
    setTimer(TIMER_LENGTH);
    setLives(0);
  };

  useEffect(() => {
    if (timer > 0 && lives < 4) {
      setTimeout(() => setTimer(timer - 1), 1000);
    }
    if (timer <= 0) {
      setLives(lives + 1);
      setTimer(TIMER_LENGTH);
    }
  }, [lives, timer]);

  useEffect(() => {
    gameStart();
  }, []);

  return (
    <main className='flex min-h-screen min-w-max bg-neutral-900 lg:pb-24'>
      <Sidebar />
      <div className='flex flex-col justify-evenly h-screen w-[80rem] bg-neutral-900 mx-auto'>
        <h1 className='text-4xl font-bold text-gray-200'>GUESSPOT</h1>
        <div className='bg-green-500 h-1/3 flex items-center justify-center'>
          <Player
            accessToken={accessToken}
            trackUri={'spotify:track:5ODOP1eIQKjtaFBYFSLWaG'}
          />
        </div>
        <div className='w-full items-center justify-center flex space-x-8'>
          <BiUndo className='text-6xl cursor-pointer text-gray-200' />
          <FastForwardIcon
            className='w-14 cursor-pointer text-gray-200'
            onClick={getRandomSong}
          />
        </div>
        <div className='w-full items-center justify-center flex space-x-8'>
          <div className='w-14 h-14 input-shadow rounded-lg'>
            {lives > 0 && <XIcon className='text-red-800' />}
          </div>
          <div className='w-14 h-14 input-shadow rounded-lg'>
            {lives > 1 && <XIcon className='text-red-800' />}
          </div>
          <div className='w-14 h-14 input-shadow rounded-lg'>
            {lives > 2 && <XIcon className='text-red-800' />}
          </div>
        </div>
        <h1 className='bg-red-500'>{timer}</h1>
        <form
          onSubmit={checkGuess}
          className='relative text-gray-200 text-2xl space-y-3 mx-auto'
        >
          <h1 className='pl-3'>Type your guess</h1>
          <input
            value={guess}
            className='w-[50rem] h-20 px-10 uppercase focus:outline-none input-shadow rounded-lg bg-[#111111] text-gray-200 text-4xl'
            onChange={({ target }) => {
              setGuess(target.value);
            }}
          />
          <button
            className='absolute right-2 h-16 w-16 top-10 bg-green-500 rounded-lg'
            type='submit'
          >
            <ArrowRightIcon className='w-10 mx-auto' />
          </button>
        </form>
        <div className='flex flex-col justify-center items-center'>
          <h1 className='text-gray-200 text-2xl'>SCORE</h1>
          <h2 className='text-gray-200 text-2xl'>{score}</h2>
        </div>
      </div>
      {checkLives()}
    </main>
  );
};

export default Game;
