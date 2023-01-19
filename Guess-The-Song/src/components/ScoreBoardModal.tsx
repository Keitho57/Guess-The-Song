import React, { useState, useRef, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationCircleIcon, FastForwardIcon } from '@heroicons/react/solid';

const ScoreBoardModal = () => {
  const [open, setOpen] = useState(true);

  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root
      show={open}
      as={Fragment}
    >
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-neutral-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                <div className='bg-neutral-900 px-4 pt-5 pb-4'>
                  <div className='my-4 text-right pr-4'>
                    <h1 className='text-green-600 text-5xl font-bold mb-2'>
                      GUESSPOT
                    </h1>
                    <h2 className='text-white text-3xl font-bold'>Game Over</h2>
                  </div>
                  <div className='flex justify-around'>
                    <div className='w-56 h-56 text-white'>
                      <h2 className='mx-auto my-2 text-center text-3xl'>
                        your score
                      </h2>
                      <h3 className='mx-auto my-6 text-center align-middle text-9xl'>
                        3
                      </h3>
                    </div>
                    <div className='w-56 h-56 px-10 input-shadow rounded-lg bg-[#111111] text-4xl text-yellow-500'>
                      <h2 className='mx-auto my-2 text-center text-3xl'>
                        high score
                      </h2>
                      <h3 className='mx-auto my-6 text-center align-middle text-9xl'>
                        3
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='bg-neutral-900 px-4 py-5 flex justify-center items-center'>
                  <button
                    type='button'
                    className='flex items-center justify-center w-3/4 rounded-md bg-green-500 px-4 py-2 text-2xl font-medium text-white focus:outline-none'
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    play again
                    <FastForwardIcon className='w-9 cursor-pointer text-gray-200' />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ScoreBoardModal;
