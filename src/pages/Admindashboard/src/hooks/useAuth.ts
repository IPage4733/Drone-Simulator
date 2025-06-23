import { useState, useCallback, createContext, useContext, useEffect } from 'react';
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
    try {
      const response = await fetch('https://34-93-79-185.nip.io/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      console.log('Login API response:', data);

      if (data?.message === 'Login successful' && data?.data?.user) {
        const user: User = {
          id: data.data.user.id?.toString() || `${role}-1`,
          name: data.data.user.full_name || 'Master Admin',
          email: data.data.user.email || email,
          role,
          avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
        };

        const token = data?.data?.token;
        if (!token) {
          console.error('Token missing in login response');
          return false;
        }

        setUser(user);
        setIsAuthenticated(true);

        const userJson = JSON.stringify(user);
        sessionStorage.setItem('drone_auth_user', userJson);
        sessionStorage.setItem('drone_auth_token', token);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('drone_auth_user');
    sessionStorage.removeItem('drone_auth_token');
  }, []);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('drone_auth_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing session user:', error);
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

export { AuthContext };
