import React, {createContext, useEffect, useReducer} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import productsApi from '../api/productsApi';
import {
  LoginData,
  LoginResponse,
  RegisterData,
  User,
} from '../interfaces/appInterfaces';
import {authReducer, AuthState} from './authReducer';

type AuthContextProps = {
  errorMessage: string;
  token: string | null;
  user: User | null;
  status: 'checking' | 'authenticated' | 'not-authenticated';
  signUp: (signupData: RegisterData) => void;
  signIn: (loginData: LoginData) => void;
  logout: () => void;
  removeError: () => void;
};

const initialState: AuthState = {
  status: 'checking',
  token: null,
  user: null,
  errorMessage: '',
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}: any) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');

    // No token, not authenticated
    if (!token) {
      return dispatch({type: 'notAuthenticated'});
    }

    // Token exists
    const {data, status} = await productsApi.get('/auth');

    if (status !== 200) {
      return dispatch({type: 'notAuthenticated'});
    }

    // Setting new token with new expire date
    await AsyncStorage.setItem('token', data.token);

    dispatch({
      type: 'signUp',
      payload: {
        token: data.token,
        user: data.usuario,
      },
    });
  };

  const signUp = async ({nombre, correo, password}: RegisterData) => {
    try {
      const {data} = await productsApi.post<LoginResponse>('/usuarios', {
        nombre,
        correo,
        password,
      });

      dispatch({
        type: 'signUp',
        payload: {
          token: data.token,
          user: data.usuario,
        },
      });

      await AsyncStorage.setItem('token', data.token);
    } catch (error: any) {
      console.log(error.response.data);
      dispatch({
        type: 'addError',
        payload: error.response.data.errors[0].msg || 'Check info',
      });
    }
  };

  const signIn = async ({correo, password}: LoginData) => {
    try {
      const {data} = await productsApi.post<LoginResponse>('/auth/login', {
        correo,
        password,
      });

      dispatch({
        type: 'signUp',
        payload: {
          token: data.token,
          user: data.usuario,
        },
      });

      await AsyncStorage.setItem('token', data.token);
    } catch (error: any) {
      console.log(error.response.data.msg);
      dispatch({
        type: 'addError',
        payload: error.response.data.msg || 'Wrong info',
      });
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    dispatch({type: 'logout'});
  };

  const removeError = () => {
    dispatch({
      type: 'removeError',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        logout,
        removeError,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
