import { HiOutlineShieldCheck } from 'react-icons/hi';
import { MdOutlineSettings } from 'react-icons/md';
import { BiBell } from 'react-icons/bi';
import { ViewGridIcon } from '@heroicons/react/solid';
import Dropdown from './Dropdown';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import RecentlyPlayed from './RecentlyPlayed';

interface Pos {
  spotifyApi: any;
  chooseTrack: any;
}
function Right({ chooseTrack, spotifyApi }: Pos) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const [recentlyPlayed, setRecentlyPlayed] = useState([] as any[]);

  // Recently Played Tracks...
  useEffect(() => {
    if (!accessToken) return;

    spotifyApi
      .getMyRecentlyPlayedTracks({ limit: 20 })
      .then((res: { body: { items: { track: any }[] } }) => {
        setRecentlyPlayed(
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

  return (
    <section className='p-4 space-y-8 pr-8'>
      <Dropdown />
      <div className='bg-[#0D0D0D] border-2 border-[#262626] p-4 rounded-xl space-y-4'>
        <div className='space-y-4 overflow-y-scroll overflow-x-hidden h-[250px] md:h-[400px] scrollbar-hide'>
          <h4 className='text-white font-semibold text-sm'>Recently Played</h4>
          {recentlyPlayed.map((track, index) => (
            <RecentlyPlayed
              key={index}
              track={track}
              chooseTrack={chooseTrack}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Right;
