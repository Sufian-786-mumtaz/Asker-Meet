import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import GradientAsset from './assets/GradientAsset';
import Button from '../components/Button';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

const Wrapper = styled.div`
  @keyframes spin {
    from {
      transform: rotate(0deg);
      opacity: 1;
    }
    to {
      transform: rotate(360deg);
      opacity: 0.2;
    }
  }

  .spin-slowly {
    animation: spin 10s linear infinite;
    animation-direction: alternate;
  }
`;

const Index = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/create")
  };




  return (
    <Wrapper>
      <Head>
        <title>AskerMeet | Interactive Jitsi Client</title>
      </Head>
      <Layout>
        <div className="w-100 flex flex-row items-center justify-center h-64 md:h-auto">
          <GradientAsset className="max-h-full w-auto spin-slowly" />
        </div>
        <div className="w-100 flex flex-row justify-center main__normal text-3xl md:text-4xl text-center px-6 md:px-0 ">
          Meetings have never been easier.
        </div>
        <div className="w-100 flex flex-row justify-center mt-4">
          <Button onClick={() => handleLogin()}>Create Meeting</Button>
        </div>
      </Layout>
    </Wrapper>
  );
};

export default Index;
