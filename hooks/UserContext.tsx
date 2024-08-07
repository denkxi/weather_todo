import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { router } from 'expo-router';

interface User {
  username: string;
  email: string;
  role: string;
}

interface UserContextProps {
  user: User | null;
  logOut: () => void;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const getUserDataFromToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode<User>(token);
        setUser({
          username: decoded.username,
          email: decoded.email,
          role: decoded.role,
        });
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  useEffect(() => {
    getUserDataFromToken();
  }, []);

  const logOut = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUser(null);
      router.push('/sign-in');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const refreshUser = () => {
    getUserDataFromToken();
  };

  return (
    <UserContext.Provider value={{ user, logOut, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
