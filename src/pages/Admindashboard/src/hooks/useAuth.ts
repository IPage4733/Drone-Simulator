import { useState, useEffect, useCallback, createContext, useContext } from 'react';

// Define user and role types
export type UserRole = 'master' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

// Create the AuthContext
export const AuthContext = createContext<AuthState | undefined>(undefined);

// Hook to consume AuthContext
export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Main AuthProvider logic
export const useAuthProvider = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // ✅ Login
  const login = useCallback(async (email: string, password: string, role: UserRole): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulated delay

    if (email && password) {
      const mockUser: User = {
        id: `${role}-1`,
        name: role === 'master' ? 'Master Admin' : 'Admin User',
        email,
        role,
        avatar: `https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2`
      };

      // ✅ Save to sessionStorage
      sessionStorage.setItem('drone_auth_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
      return true;
    }

    return false;
  }, []);

  // ✅ Logout
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('drone_auth_user');
  }, []);

  // ✅ Load from sessionStorage on initial load
  useEffect(() => {
    const storedUser = sessionStorage.getItem('drone_auth_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (err) {
        sessionStorage.removeItem('drone_auth_user');
      }
    }
  }, []);

  return {
    user,
    isAuthenticated,
    login,
    logout
  };
};
