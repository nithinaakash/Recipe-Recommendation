// context/AuthContext.js
import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const router = useRouter()
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [user, setUser] = useState(null);
  const [recipeList, setRecipeList] = useState(null);
  const [recipes, setRecipes] = useState(null);
  const [recipeImages, setRecipeImages] = useState(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('access') ? localStorage.getItem('access') : null;
    const storedRefreshToken = localStorage.getItem('refresh') ? localStorage.getItem('refresh') : null;
    setAccessToken(storedAccessToken);
    setRefreshToken(storedRefreshToken);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.status === 400 || response.status === 401 || response.status === 403) {
        return data;
      }
      else if (response.status === 200) {
        setAccessToken(data.access);
        setRefreshToken(data.refresh);
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const register = async (username, first_name, last_name, email, gender, dob, password) => {
    try {
      const response = await fetch('/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, first_name, last_name, email, gender, dob, password }),
      });
      const data = await response.json();
      if (response.ok && response.status === 200) {
        console.log("Registration Successful");
        router.push('/verify_account');
      }
      else {
        console.log("Registration Failed");
        alert(data.message + "\n" + JSON.stringify(data.data));
      }
    }
    catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  }

  const getUser = async () => {
    if (!accessToken) {
      return;
    }
    try {
      const response = await fetch('/api/getUser/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (response.ok && response.status === 200) {
        setUser(data);
      }
    }
    catch (error) {
      console.error('User data error:', error);
    }
  }

  const getRecipeList = async () => {
    if (!accessToken) {
      return;
    }
    try {
      const response = await fetch('/api/getRecipeList/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (response.ok && response.status === 200) {
        setRecipeList(data);
      }
    }
    catch (error) {
      console.error('Recipe List error:', error);
    }
  }

  const getRecipes = async (search_term) => {
    try {
      const response = await fetch('/api/getRecipes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ "user_input": search_term }),
      });
      const data = await response.json();
      if (response.ok && response.status === 200) {
        setRecipes(data);
      }
    }
    catch (error) {
      console.error('Recipe List error:', error);
    }
  }
  
  const getRecipeImages = async (search_term) => {
    try {
      const response = await fetch(`api/getRecipeImages?search=${search_term}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic Og==`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log("settingimage");
        setRecipeImages(data[0].full);
        return data[0].full;
        // return 
      } else {
        console.error('Failed to fetch images:', data);
        setRecipeImages(null);
      }

    } catch (error) {
      console.error('Error fetching images:', error);
      setRecipeImages(null);
    }
  }

  const dashboard_init = async () => {
    getUser();
    getRecipeList();
  }

  const clearRecipes = () => {
    setRecipes(null);
    setRecipeImages(null);
  }

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    clearRecipes();
    setRecipeList(null);
    setUser(null);
    router.push('/');
  };

  const verifyAccount = async (email, code) => {
    try {
      const response = await fetch('/api/verifyAccount/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();
      if (response.ok && response.status === 200) {
        console.log("Account Verified");
        router.push('/login');
      }
      else {
        console.log("Account Verification Failed");
        alert(data.message + "\n" + JSON.stringify(data.data));
      }
    }
    catch (error) {
      console.error('Account Verification error:', error);
      alert('Account Verification failed. Please try again.');
    }
  }


  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, login, logout, register, user , recipeList, getRecipes, recipes, getRecipeImages, recipeImages, dashboard_init, getUser, clearRecipes, verifyAccount  }}>
      {children}
    </AuthContext.Provider>
  );
};
