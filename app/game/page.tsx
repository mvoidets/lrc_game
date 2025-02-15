"use client";
import dynamic from "next/dynamic";
import GameStats from '../components/gameStats';
import { initializeApp } from '../lib/actions';
import { useEffect } from "react";
import getSession from '../lib/getSession';

const Rules = () => {
  const VideoPlayer = dynamic(() => import("../components/VideoPlayer"), {
    ssr: false,
  });
  const getAuth = async() => {
        const userData = await getSession()
        console.log('session user data', userData)

  }
  useEffect(() => {
    getAuth() 
  }, [])

  useEffect(() => {
    const initialize = async () => {
      await initializeApp();
    }
    initialize()
  }, [])


  return (
    <div className="min-h-screen flex items-center justify-center">
      <VideoPlayer url="https://www.youtube.com/watch?v=OxxpTWk3Rx0&t=21s" />
      <GameStats />
    </div>
  );
};

export default Rules;
