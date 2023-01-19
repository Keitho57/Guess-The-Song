import { NextApiRequest, NextApiResponse } from "next";

const getRandomSong = async (req: any, res: NextApiResponse) => {
  // A list of all characters that can be chosen.
const characters = 'abcdefghijklmnopqrstuvwxyz';
  
// Gets a random character from the characters string.
const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
let randomSearch = '';

// Places the wildcard character at the beginning, or both beginning and end, randomly.
switch (Math.round(Math.random())) {
  case 0:
    randomSearch = randomCharacter + '%';
    break;
  case 1:
    randomSearch = '%' + randomCharacter + '%';
    break;
}

return randomSearch;
  try {
    const access_token = req.accessToken;
    const response = await fetch('https://api.spotify.com/v1/tracks/random', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const song = response.json;
    console.log('here', song)
    // res.json(song);
  } catch (error: any) {
    console.error(error);
    res.status(error.response.status).json({ message: error.response.statusText });
  }
};

export default getRandomSong;

// import { NextApiRequest, NextApiResponse } from "next";

// const getRandomSong = async (req: any, res: NextApiResponse) => {
//   try {
//     const access_token = req.accessToken;
//     const response = await fetch('https://api.spotify.com/v1/tracks/random', {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//       },
//     });
//     const song = response.json;
//     console.log('here', song)
//     // res.json(song);
//   } catch (error: any) {
//     console.error(error);
//     res.status(error.response.status).json({ message: error.response.statusText });
//   }
// };

// export default getRandomSong;
