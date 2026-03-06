"use client";
import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  use,
} from "react";
import axios from "axios";
import { fromUrlFormat, toUrlFormat } from "../../utils/lib/urlFormatter";
import { set } from "zod";
import { User } from "@/utils/lib/types";
import { error } from "console";

const API_KEY = "http://localhost:3000/api";

interface AuthContextType {
  user: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
  registerUser: (newuser: User) => Promise<void>;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);

  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,
  });
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      try {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isAuthenticated: true,
          user: JSON.parse(savedUser),
        }));
        setUsers((prev) => [JSON.parse(savedUser), ...prev]);
        // setUser(JSON.parse(savedUser));
        // setIsAuthenticated(true);
      } catch (err) {
        console.error("Error parsing user data from localStorage:", err);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to load user data",
          isAuthenticated: false,
        }));
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    }
  }, []);
  const registerUser = useCallback(async (newuser: User) => {
    const { username, email, password } = newuser;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await axios.post(`${API_KEY}/users/register`, newuser);

      const { token, user } = response.data;
      setState({
        user,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      });
      // setIsAuthenticated(true);
      // setUser(user);

      setUsers((prev) => [user, ...prev]);
      localStorage.setItem("new user token", token);
      localStorage.setItem("new user", JSON.stringify(user));
      return user;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Registration error",
      }));
    }
  }, []);

  const login = useCallback(async (user: User) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await axios.post(`${API_KEY}/users/login`, user);
      if (response.status === 200) {
        const { token, user: loggedInUser } = response.data;
        setState({
          user: loggedInUser,
          isLoading: false,
          error: null,
          isAuthenticated: true,
        });
        // setUser(loggedInUser);
        // setIsAuthenticated(true);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
      } else if (response.status === 400) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "this email does not exist",
          isAuthenticated: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Login failed",
          isAuthenticated: false,
        }));
      }
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Login error",
        isAuthenticated: false,
      }));
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setState({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    });
  }, []);
  const contextValue = useMemo(
    () => ({
      user: state.user,
      users,
      loading: state.isLoading,
      error: state.error,
      isAuthenticated: state.isAuthenticated,
      registerUser,
      login,
      logout,
    }),
    [
      state.user,
      state.isLoading,
      state.error,
      state.isAuthenticated,
      users,
      registerUser,
      login,
      logout,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
