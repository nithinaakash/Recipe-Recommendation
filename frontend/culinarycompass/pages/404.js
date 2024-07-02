import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Custom404 = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login'); // Redirect to the login page after 2 seconds
    }, 2000);

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container">
      <h1 className="title">404 - Page Not Found</h1>
      <p className="description">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <p>Redirecting to home...</p>
    </div>
  );
}

export default Custom404;