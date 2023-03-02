import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import GradientAsset from '../assets/GradientAsset';
import Button from '../../components/Button';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';


const Wrapper = styled.div`
  background-color: #f9fbfe;

  @keyframes breathe {
    from {
      opacity: 1;
      transform: rotate(0deg);
    }
    to {
      opacity: 0;
      transform: rotate(360deg);
    }
  }

  .spin-slowly {
    animation: breathe 3s ease-in-out infinite;
    animation-direction: alternate;
  }
`;

const Index = () => {
  const [roomName, setRoomName] = useState('');
  const [personName, setPersonName] = useState('');
  const [personId, setPersonId] = useState('');
  const [userName, setUserName] = useState('');
  const router = useRouter();
  console.log(roomName)
  const handleCreateMeeting = () => {
    if (roomName.length > 0 && personName.length > 0 && personId.length > 0) {
      const formattedRoomName = roomName.split(' ').join('-');
      router.push({
        pathname: '/meet',
        query: {
          meetId: formattedRoomName,
          personName,
          personId
        },
      });
    }else {
      router.push({
        pathname: '/create',
      });
    }
  };






  return (
    <Wrapper>
      <Head>
        <title>AskerMeet | Create Meeting</title>
      </Head>
      <Layout>
        <div className="w-100 flex flex-row items-center justify-center h-64 md:h-auto">
          <GradientAsset className="max-h-full w-auto spin-slowly" />
        </div>
        <div className="w-100 flex flex-row justify-center main__normal text-3xl md:text-4xl text-center px-6 md:px-0 ">
          Hello, {userName}.
        </div>
        <div className="w-100 flex flex-row justify-center main__normal text-3xl md:text-4xl text-center px-6 md:px-0 my-2 ">
          <input
            className="appearance-none rounded w-full md:w-1/2 py-2 px-3 text-muted leading-tight text-lg focus:shadow-md focus:outline-none"
            type="text"
            placeholder="Meeting Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
          />
        </div>
        <div className="w-100 flex flex-row justify-center main__normal text-3xl md:text-4xl text-center px-6 md:px-0 my-2 ">
          <input
            className="appearance-none rounded w-full md:w-1/2 py-2 px-3 text-muted leading-tight text-lg focus:shadow-md focus:outline-none"
            type="text"
            placeholder="Person Name"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            required
          />
        </div>
        <div className="w-100 flex flex-row justify-center main__normal text-3xl md:text-4xl text-center px-6 md:px-0 my-2 ">
          <input
            className="appearance-none rounded w-full md:w-1/2 py-2 px-3 text-muted leading-tight text-lg focus:shadow-md focus:outline-none"
            type="text"
            placeholder="Person Id"
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
            required
          />
        </div>
        <div className="w-100 flex flex-row justify-center mt-4">
          <Button  onClick={() => handleCreateMeeting()}>CREATE MEETING</Button>
        </div>
        
      </Layout>
    </Wrapper>
  );
};

export default Index;
