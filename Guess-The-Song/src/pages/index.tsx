import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Dashboard from '../components/Dashboard';
import { useRouter } from 'next/router';
import Loader from '../components/Loader';

const Home: NextPage = () => {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });
  if (status === 'loading') {
    return <Loader />;
  }
  return (
    <>
      <Head>
        <title>CS322 Music Programming</title>
        <meta
          name='Authors'
          content="Keith O'Hanlon, Ross Ward"
        />
        <meta
          name='viewport'
          content='initial-scale=1.0, width=device-width'
        />
        <link
          rel='shortcut icon'
          href='/MaynoothLogo.png'
        />
      </Head>

      <Dashboard />
    </>
  );
};

export default Home;
