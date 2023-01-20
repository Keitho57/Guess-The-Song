import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Poster from './Poster';
import Search from './Search';
import Track from './Track';

interface SpotiApi {
  spotifyApi: any;
  chooseTrack: any;
}

function Body({ spotifyApi, chooseTrack }: SpotiApi) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const [search, setSearch] = useState('search...');
  const [searchResults, setSearchResults] = useState([] as any[]);
  const [newReleases, setNewReleases] = useState([] as any[]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  // Searching...
  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;

    spotifyApi
      .searchTracks(search)
      .then((res: { body: { tracks: { items: any[] } } }) => {
        if (cancel) return;
        setSearchResults(
          res.body.tracks.items.map((track) => {
            return {
              id: track.id,
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumUrl: track.album.images[0].url,
              popularity: track.popularity,
            };
          })
        );
      });
    return () => {
      cancel = false;
    };
  }, [search, accessToken]);

  // New Releases
  useEffect(() => {
    if (!accessToken) return;

    spotifyApi
      .getNewReleases()
      .then((res: { body: { albums: { items: any[] } } }) => {
        setSearchResults(
          res.body.albums.items.map((track) => {
            return {
              id: track.id,
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumUrl: track.images[0].url,
              popularity: track.popularity,
            };
          })
        );
      });
  }, [search, accessToken]);

  return (
    <section className='bg-neutral-900 ml-24 py-4 space-y-8 w-full'>
      <Search
        search={search}
        setSearch={setSearch}
      />
      <div className='grid overflow-y-scroll scrollbar-hide h-96 py-4 grid-cols-4 gap-x-4 gap-y-8 p-4'>
        {searchResults.length === 0
          ? newReleases.slice(0, 4).map((track) => (
              <Poster
                key={track.id}
                track={track}
                chooseTrack={chooseTrack}
              />
            ))
          : searchResults.slice(0, 4).map((track) => (
              <Poster
                key={track.id}
                track={track}
                chooseTrack={chooseTrack}
              />
            ))}
      </div>

      <div className='flex gap-x-8 w-full '>
        <div className='p-2 w-full'>
          <h2 className='text-white font-bold mb-3'>
            {searchResults.length === 0 ? 'New Releases' : 'Tracks'}
          </h2>
          <div
            className='space-y-3 border-2 border-[#262626] rounded-2xl p-3 bg-[#0D0D0D] overflow-y-scroll h-[1000px] md:h-96 scrollbar-thin
         scrollbar-thumb-gray-600 scrollbar-thumb-rounded hover:scrollbar-thumb-gray-500 w-max-full'
          >
            {searchResults.length === 0
              ? newReleases.slice(4, newReleases.length).map((track) => (
                  <Track
                    key={track.id}
                    track={track}
                    chooseTrack={chooseTrack}
                  />
                ))
              : searchResults.slice(4, searchResults.length).map((track) => (
                  <Track
                    key={track.id}
                    track={track}
                    chooseTrack={chooseTrack}
                  />
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Body;
