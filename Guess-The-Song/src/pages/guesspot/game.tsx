import React, { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

import SpotifyPlayer from 'react-spotify-web-playback';
import { spotifyApi } from '../../utils/spotify';

import ScoreBoardModal from '../../components/ScoreBoardModal';
import Sidebar from '../../components/Sidebar';

import {
  ArrowRightIcon,
  CheckCircleIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  XCircleIcon,
  XIcon,
} from '@heroicons/react/solid';
import { BiUndo } from 'react-icons/bi';
import { Transition } from '@headlessui/react';

const TIMER_LENGTH = 30;
const TRACK_LIMIT = 50;

const Game = () => {
  const [timer, setTimer] = useState(TIMER_LENGTH);
  const [isPlaying, setIsPlaying] = useState(true);
  const [song, setSong] = useState<any>(null);
  const [tracks, setTracks] = useState<any>();
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(0);
  const [showMessage, setShowMessage] = useState<any>(null);

  const rightAnswer = () => {
    setShowMessage('right');
    setTimeout(() => {
      setShowMessage(false);
    }, 500);
  };

  const wrongAnswer = () => {
    setShowMessage('wrong');
    setTimeout(() => {
      setShowMessage(false);
    }, 500);
  };

  const { data: session } = useSession();
  const accessToken: any = session?.accessToken;

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi
      .getMyRecentlyPlayedTracks({ limit: TRACK_LIMIT })
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
  }, [accessToken]);

  useEffect(() => {
    gameStart();
  }, [tracks]);

  const randomSong = () => {
    if (!tracks) return;
    const randomIndex = Math.floor(Math.random() * TRACK_LIMIT);
    setSong(tracks[randomIndex]);
  };

  const checkGuess = (e: any) => {
    e.preventDefault();
    if (song === null) return;

    if (guess.toLowerCase() === song!.title.toLowerCase()) {
      rightAnswer();
      setScore(score + 1);
      setGuess('');
      setTimer(TIMER_LENGTH);
      return randomSong();
    }
    wrongAnswer();
    setLives(lives + 1);
    setGuess('');
    checkLives();
  };

  const checkLives = () => {
    if (lives > 3) {
      setIsPlaying(false);
      return (
        <ScoreBoardModal
          score={score}
          startGame={gameStart}
        />
      );
    }
  };

  const gameStart = () => {
    randomSong();
    setGuess('');
    setTimer(TIMER_LENGTH);
    setLives(0);
    setScore(0);
  };

  useEffect(() => {
    let timeoutId: any;
    if (timer > 0 && lives < 4) {
      timeoutId = setTimeout(() => setTimer(() => timer - 1), 1000);
    }
    if (timer <= 0) {
      wrongAnswer();
      setLives(lives + 1);
      setTimer(TIMER_LENGTH);
    }
    return () => clearTimeout(timeoutId);
  }, [timer]);

  const skipPowerup = () => {
    randomSong();
    setGuess('');
    setTimer(TIMER_LENGTH);
    wrongAnswer();
    setLives(lives + 1);
  };

  return (
    <main className='flex min-h-screen min-w-max bg-neutral-900 lg:pb-24'>
      <Sidebar />
      <div className='flex flex-col justify-evenly h-screen w-[80rem] bg-neutral-900 mx-auto'>
        <h1 className='text-4xl font-bold text-gray-200'>GUESSPOT</h1>
        <div className='bg-green-500 h-1/3 hidden'>
          {song && (
            <SpotifyPlayer
              token={accessToken}
              uris={song!.uri}
              autoPlay
              play={isPlaying}
            />
          )}
        </div>

        <div className='flex justify-between w-[60rem] mx-auto'>
          <div className='flex'>
            {song && (
              <img
                src={song.albumUrl}
                width={250}
                height={250}
                alt='album art cover'
                className='shadow-2xl'
              />
            )}
            <div className='flex flex-col'>
              <caption className='text-left text-6xl font-bold text-gray-200 m-5'>
                {song && song.artist}
              </caption>
              <div className='w-full items-start justify-start flex space-x-8 mx-5'>
                <BiUndo className='text-6xl cursor-pointer text-gray-200' />
                <FastForwardIcon
                  className='w-14 cursor-pointer text-gray-200'
                  onClick={() => skipPowerup()}
                />
                {isPlaying ? (
                  <PauseIcon
                    className='w-14 cursor-pointer text-gray-200'
                    onClick={() => setIsPlaying(!isPlaying)}
                  />
                ) : (
                  <PlayIcon
                    className='w-14 cursor-pointer text-gray-200'
                    onClick={() => setIsPlaying(!isPlaying)}
                  />
                )}
              </div>
            </div>
          </div>
          <div className='w-40 text-[10rem] text-bold text-gray-200'>
            {timer}
          </div>
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
      {showMessage && (
        <Transition
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
          show
        >
          <div className='left-0 right-0 w-full h-full absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center transition-all'>
            {showMessage === 'right' ? (
              <CheckCircleIcon className='w-36 cursor-pointer text-green-500' />
            ) : (
              <XCircleIcon className='w-36 cursor-pointer text-red-800' />
            )}
          </div>
        </Transition>
      )}
      {checkLives()}
    </main>
  );
};

export default Game;
