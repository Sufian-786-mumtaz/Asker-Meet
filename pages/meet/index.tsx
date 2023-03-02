import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Head from 'next/head'
import jwt_decode from 'jwt-decode'
import LeftMeeting from './LeftMeeting'
import { JaaSMeeting } from "@jitsi/react-sdk"
import Urls from '../../Constant/Urls'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Recorder = require('../../utils/Recorder/recorder')
const MeetWithIDPage = ({ token }:any) => {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [jwt, setJWT] = useState('');
  const [isMeetingLeft, setIsMeetingLeft] = useState(false)
  const { meetId, personName, personId } = router.query;
  // console.log("token in FE ",token)
  useEffect(() => {
   
    const decoded = jwt_decode(token);
    setUserName("t");
    setJWT(token);
  }, []);

  const handleApi = (JitsiMeetAPI) => {
    let rec; // Recorder.js object
    let input; // MediaStreamAudioSourceNode we'll be recording
    let audioContext //audio context to help us record
    Recorder.prototype.step = function () {
      this.clear();
    };
    JitsiMeetAPI.addEventListener('videoConferenceJoined', () => {
      navigator?.mediaDevices?.getUserMedia({ audio: true }).then((stream) => {
        audioContext = new AudioContext();
        //Use the stream 
        input = audioContext.createMediaStreamSource(stream)
        //Create the Recorder object and configure to record mono sound (1 channel)
        rec = new Recorder(input, {
          numChannels: 1
        });
        console.log("Recording started")
        rec.record()
        
        function save_blob(){
          rec.exportWAV(createWaveBlob)
          rec?.step();
        }
        const interval = setInterval(() => {
          save_blob()
        }, 3000)

        JitsiMeetAPI.addEventListener("videoConferenceLeft", () => {
          clearInterval(interval)
        })
      })
    })
    const socket = new WebSocket(`${Urls.baseUrl}/`)
    function webSocket(base64:string){
      const meetingInfo = {
        audio: base64,
        meetingId: meetId,
        personId:personId,
        timeStamp: new Date(),
      }
      console.log(meetingInfo)
        socket.send(JSON.stringify(meetingInfo))
      socket.onmessage = (event) =>{
        console.log("incoming message from server-------->", event.data)
      }
      socket.onerror = (error) =>{
        console.log(error)
      }
    }
    function createWaveBlob(blob) {
      console.log(blob)
      const promise = new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = (e) => resolve(e.target.result)
        reader.readAsDataURL(blob);
      });
       promise.then((base64:string) =>{
       webSocket(base64)
      }).catch((error) =>{
        console.log(error)
      })
    }
    JitsiMeetAPI.addEventListener('videoConferenceLeft', () => {
      socket.close();
      setIsMeetingLeft(true);
      setTimeout(() => {
        router.push('/');
      }, 3000);
    });
    // JitsiMeetJS.init();
    // JitsiMeetJS.createLocalTracks().then((context) => {
    //   console.log("context data--------------->> ", context)
    // });
  };
  const renderSpinner = () => (
    <div style={{
      fontFamily: 'sans-serif',
      textAlign: 'center'
    }}>
      Loading..
    </div>
  );
  return (
    <>
      <Head>
        {/* <script src="https://jitsi-editreadmedapatbaju.cs.ui.ac.id/jitsi/external_api.js"></script> */}
        <title>AskerMeet | {meetId} Meeting</title>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script src="https://meet.jit.si/libs/lib-jitsi-meet.min.js"></script>

      </Head>
      <div className=" w-screen h-screen">
        <div id="jitsi-container" className="w-full h-full">
          {isMeetingLeft ? (
            <LeftMeeting />
          ) : userName === '' ? (
            'loading...'
          ) : (
            <JaaSMeeting
              getIFrameRef={iframeRef => { iframeRef.style.height = '100%'; }}
              appId={"vpaas-magic-cookie-2a322d54b3f943dfa816912c1ef67a50"}
              roomName={`${meetId}`}
              jwt={token}
              configOverwrite={{
                disableThirdPartyRequests: true,
                disableLocalVideoFlip: true,
                backgroundAlpha: 0.5
              }}
              interfaceConfigOverwrite={{
                VIDEO_LAYOUT_FIT: 'nocrop',
                MOBILE_APP_PROMO: false,
                TILE_VIEW_MAX_COLUMNS: 4
              }}
              spinner={renderSpinner}
              onApiReady={handleApi}
            />
        
          )}
        </div>
      </div>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getServerSideProps({ query }) {

  // Get external data from the file system, API, DB, etc.
  const { meetId, personName, personId } = query;

  const privateKey = fs.readFileSync('private.key');
  const now = new Date()
  const token = jwt.sign({
    "aud": "jitsi",
    "iss": "chat",
    "iat": 1675162429,
    "exp": Math.round(now.setHours(now.getHours() + 3) / 1000),
    "nbf": (Math.round((new Date).getTime() / 1000) - 10),
    "sub": process.env.JITSI_APP_ID,
    "context": {
      "features": {
        "livestreaming": false,
        "outbound-call": true,
        "sip-outbound-call": false,
        "transcription": true,
        "recording": true
      },
      "user": {
        "hidden-from-recorder": false,
        "moderator": true,
        "name": personName,
        "id": `auth0|63d25fdef75d748567191706${personId}`,
        "avatar": "",
        "email": "irfankhalid544@gmail.com"
      }
    },
    "room": meetId
  }, privateKey, { algorithm: 'RS256', noTimestamp: true, header: { "typ": "JWT", "kid": process.env.JITSI_KID } }
  )

  // const token = "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtMmEzMjJkNTRiM2Y5NDNkZmE4MTY5MTJjMWVmNjdhNTAvOTEwMzBlLVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE2NzUxNTg2NjMsImV4cCI6MTY3NTE2NTg2MywibmJmIjoxNjc1MTU4NjU4LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtMmEzMjJkNTRiM2Y5NDNkZmE4MTY5MTJjMWVmNjdhNTAiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlfSwidXNlciI6eyJoaWRkZW4tZnJvbS1yZWNvcmRlciI6ZmFsc2UsIm1vZGVyYXRvciI6dHJ1ZSwibmFtZSI6ImlyZmFua2hhbGlkNTQ0IiwiaWQiOiJhdXRoMHw2M2QyNWZkZWY3NWQ3NDg1NjcxOTE3MDYiLCJhdmF0YXIiOiIiLCJlbWFpbCI6ImlyZmFua2hhbGlkNTQ0QGdtYWlsLmNvbSJ9fSwicm9vbSI6IioifQ.EYE3T4n64sTUdgYIWKkZv6P6NmQsmTHcleK8QyMKqwWdmCsBYeCK5WGvsfmyv7UOtvnxffkVs3if1XEovIo_rhFZd9j1eK4I32wDi9oG6v54XZ6a58JnRgehU2o9NFzu-lY9DreR0-6wTUK9aXwAfBOun_ZH-17dpcpDsZJtnSteBS-8p6jQWoTYeTleLmNTL5SQikf2DjonSA6c0Hp2BiDmRL1_igN63-5VscACBbzBaheko5dPMlAr25cbhNqAqTg43HK5h06xduDs-wTet3pal6nD-NjMd_MUSevTawW2pcR1ynqFDvEJEVTMPQ5ESorggy1MaNb3k1GQmnkt-g"

  // The value of the `props` key will be
  //  passed to the `Home` component
  return {
    props: {
      token: token
    }
  }
}
export default MeetWithIDPage;
