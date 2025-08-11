"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { LOGIN_MUTATION, REGISTER_MUTATION } from "@/lib/graphql/mutations";
import { LoginInput, RegisterInput } from "@/types/types";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: LoginInput) => Promise<void>;
  signup: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isProcessing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = Cookies.get("auth_token");
    const storedUser = Cookies.get("user_data");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const [loginMutation, { loading: loginLoading }] = useMutation(
    LOGIN_MUTATION,
    {
      onCompleted: (data) => {
        const { token, user, message } = data.login;
        setToken(token);
        setUser(user);
        Cookies.set("auth_token", token, { expires: 7, secure: true });
        Cookies.set("user_data", JSON.stringify(user), {
          expires: 7,
          secure: true,
        });
        toast.success(message || "Login successful!");
        router.push("/dashboard");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const [registerMutation, { loading: registerLoading }] = useMutation(
    REGISTER_MUTATION,
    {
      onCompleted: (data) => {
        const { token, user, message } = data.register;
        setToken(token);
        setUser(user);
        Cookies.set("auth_token", token, { expires: 7, secure: true });
        Cookies.set("user_data", JSON.stringify(user), {
          expires: 7,
          secure: true,
        });
        toast.success(message || "Registration successful!");
        router.push("/dashboard");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const login = async (data: LoginInput) => {
    await loginMutation({ variables: data });
  };

  const signup = async (data: RegisterInput) => {
    await registerMutation({ variables: data });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove("auth_token");
    Cookies.remove("user_data");
    toast.success("You have been logged out.");
    router.push("/login");
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    isLoading,
    isProcessing: loginLoading || registerLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
