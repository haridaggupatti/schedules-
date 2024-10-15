import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  role: 'admin' | 'hr' | 'interviewer';
}

interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    // In a real application, you would make an API call to authenticate the user
    // For this example, we'll use a mock authentication
    if (username === 'admin' && password === 'password') {
      const user: User = { id: 1, username: 'admin', role: 'admin' };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } else if (username === 'hr' && password === 'password') {
      const user: User = { id: 2, username: 'hr', role: 'hr' };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } else if (username === 'interviewer' && password === 'password') {
      const user: User = { id: 3, username: 'interviewer', role: 'interviewer' };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};