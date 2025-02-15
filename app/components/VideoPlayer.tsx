import React from "react";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen pt-24">
      <div className="bg-gray-800 w-[1100px] h-[600px] rounded-xl shadow-xl flex items-center justify-center max-4-4xl aspect-video ">
        <ReactPlayer url={url} controls width="1000px" height="500px" />
      </div>
    </div>
  );
};

export default VideoPlayer;
