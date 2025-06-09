import { useState, useCallback, createContext, useContext } from 'react';
import { User, UserRole, AuthState } from '../types/auth';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = useCallback(async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in production, this would be a real API call
    if (email && password) {
      const mockUser: User = {
        id: `${role}-1`,
        name: role === 'master' ? 'Master Admin' : 'Admin User',
        email,
        role,
        avatar: `https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2`
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('drone_auth_user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('drone_auth_user');
  }, []);

  // Check for existing session on hook initialization
  useState(() => {
    const storedUser = localStorage.getItem('drone_auth_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('drone_auth_user');
      }
    }
  });

  return {
    user,
    isAuthenticated,
    login,
    logout
  };
};

export { AuthContext };