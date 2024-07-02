// pages/index.js
import Link from 'next/link';
import { useAuth } from '@/context/Authcontext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
export default function Home() {
  const router = useRouter();
  const { accessToken, refreshToken } = useAuth();
  useEffect(() => {
    if (accessToken && refreshToken) {
      router.push('/dashboard');
    }
  },[accessToken]);
  return (
    <div className="container max-w-full">
      <img src="/images/Food_Logo.jpg" alt="Culinary Compass Logo" className="logo" />
      <h1 className="title">Welcome To Culinary Compass</h1>
      <p className="description">
        Embark on a journey to discover and create mouth-watering recipes from around the globe. Let your culinary adventure begin!
      </p>
      <div>
        <Link href="/login" passHref>
          <button className="button">Login</button>
        </Link>
        <Link href="/register" passHref>
          <button className="button">Register</button>
        </Link>
      </div>
    </div>
  );
}
