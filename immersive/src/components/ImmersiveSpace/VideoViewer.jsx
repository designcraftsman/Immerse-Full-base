import React, { useRef, useState, useEffect } from 'react';
import pause from "../../assets/ImmersiveSpace/icons/pause.webp";
import play from "../../assets/ImmersiveSpace/icons/play.webp";

function VideoViewer({  position = "0 0 0", rotation = "0 0 0", scale = "1 1 1" }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);


  const handleToggle = () => {
    const video = videoRef.current?.getObject3D('mesh')?.material?.map?.image;
    
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    const videoEl = videoRef.current;

    if (videoEl) {
      // Ensure the video is paused initially
      setIsPlaying(false);
    }

    return () => {
      if (videoEl) {
        videoEl.removeEventListener('loadeddata', handleToggle);
      }
    };
  }, []);

  return (
    <a-entity position={position} rotation={rotation} scale={scale}>
      <a-video
        ref={videoRef}
        src="#video"
        position="0 0 0"
        rotation="0 0 0"
        width="4"
        height="2.25"
        loop="false"
        preload="auto"
        paused
        autoplay={false} // Ensure autoplay is disabled
        class="selectable"
      />
      <a-entity position="0 -1 0.1" rotation="0 0 0">
        <a-image 
          src={isPlaying ? pause : play}
          position="0 0 0" 
          width="0.5" 
          height="0.5" 
          depth="0.1" 
          class="clickable"
          onClick={handleToggle}  // Use React's onClick handler
        />
      </a-entity>
    </a-entity>
  );
}

export default VideoViewer;
