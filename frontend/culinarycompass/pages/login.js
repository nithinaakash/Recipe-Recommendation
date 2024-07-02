// LoginForm.js
// Import styled-components

import { useState } from 'react';
import styles from './login.module.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/Authcontext';
// Your Component
const LoginForm = () => {

  const router = useRouter();
  const { accessToken, refreshToken, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  useEffect(() => {
    if (accessToken && refreshToken) {
      router.push('/dashboard');
    }
  },[accessToken]);
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const er = await login(username, password);
    // check if error exists and not a json response
    if (er && er) {
      setError(er);
    }
    // Handle login logic
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.formContainer} `}>
      <h2 className={styles.title}>Login</h2>
      <input type="name" name="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)} className={styles.inputField} required />
      <input type="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className={styles.inputField} required />
      {error && <p color='red'>{JSON.stringify(error)}</p>}
      <button disabled={username == "" || password == ""} type="submit" className={`${styles.button} ${styles.submitButton}`}>Login</button>
      {/* <button  type="submit" className={`${styles.button} ${styles.submitButton}`}>Login</button> */}
    </form>
  );
};

export default LoginForm;
