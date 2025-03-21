import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Hls from "react-hls-player";


import MediaPipeFaceMesh from './MediaPipeFaceMesh';

function App() {
  return (
    <div>
      <MediaPipeFaceMesh />
        <Hls
            src="https://shubusket.s3.ap-northeast-2.amazonaws.com/hls/5cd3c1e9-4544-4e33-af7e-2827553da39e/playlist.m3u8"
            autoPlay={false}
            controls={true}
            width="100%"
            height="auto"
        />    </div>
  );
}

export default App
