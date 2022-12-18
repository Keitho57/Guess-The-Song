import * as React from 'react';
import * as trpc from 'trpc';
import * as SpotifyWebApi from 'spotify-web-api-node';


interface GetRandomSongProps {
  spotifyUsername: string;
  spotifyToken: string;
}

interface GetRandomSongState {
  track: SpotifyApi.TrackObjectFull | null;
  error: string | null;
}
const getRandomSong: any{
    
}


export default getRandomSong;