import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import axios from 'axios';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (userType, email, password) => {
    setIsLoading(true);
    setError(null);

    let url = '';

    switch (userType) {
      case 'user':
        url = import.meta.env.VITE_REACT_APP_LOGIN_USER_ENDPOINT;
        break;
      case 'specialist':
        url = import.meta.env.VITE_REACT_APP_LOGIN_SPECIALIST_ENDPOINT;
        break;
      default:
        throw new Error('Invalid user type');
    }

    try {
      const response = await axios.post(url, { email, password }, {
        headers: { 'Content-Type': 'application/json' }
      });
      const json = response.data;
      console.log("Login response: ", json);

      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(json));

      // update the auth context
      dispatch({ type: 'LOGIN', payload: json });

      // update loading state
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.response ? error.response.data.error : 'An error occurred');
    }
  };

  return { login, isLoading, error };
};
