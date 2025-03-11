import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { customAxios } from "@/config/axios";
import { ProfileInputs } from "@/pages/Profile/ProfileForm";

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  YOB: number;
  gender: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  updateProfile: (user: ProfileInputs) => void;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data } = await customAxios.get("/auth/self");
        setCurrentUser(data.currentUser);
      } catch (error) {
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await customAxios.post("/auth/signin", {
        email,
        password,
      });
      setCurrentUser(data);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any) => {
    setIsLoading(true);
    try {
      await customAxios.post("/auth/signup", userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await customAxios.post("/auth/signout");
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (user: ProfileInputs) => {
    setCurrentUser((prev) => ({
      ...prev!,
      name: user.name,
      YOB: user.YOB,
      gender: Boolean(user.gender),
    }));
  };

  const value = {
    currentUser,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
