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
import { useRouter } from "next/navigation";
const API_KEY = "http://localhost:3000/api";
import { z } from "zod";
import { ca, is } from "zod/v4/locales";
import { toast } from "sonner";
import { CircleX, Info } from "lucide-react";
import { supabase } from "../../../supabase/client";
import { deleteUserAccount } from "../actions/deleteAccount";

const formSchema = z.object({
  username: z.string().min(4, "Username is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  password: z.string().optional(),
});

interface AuthContextType {
  user: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
  registerUser: (newuser: User) => Promise<void>;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateUserData: (id: string, formdata: any) => Promise<any>;
  deleteAccount: (id: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
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
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,
  });
  useEffect(() => {
    // const token = localStorage.getItem("token");
    // const savedUser = localStorage.getItem("user");
    // if (token && savedUser) {
    //   try {
    //     setState((prev) => ({
    //       ...prev,
    //       isLoading: false,
    //       isAuthenticated: true,
    //       user: JSON.parse(savedUser),
    //     }));
    //   } catch (err) {
    //     console.error("Error parsing user data from localStorage:", err);
    //     setState((prev) => ({
    //       ...prev,
    //       isLoading: false,
    //       error: "Failed to load user data",
    //       isAuthenticated: false,
    //     }));
    //     localStorage.removeItem("authToken");
    //     localStorage.removeItem("user");
    //     localStorage.removeItem("new user token");
    //     localStorage.removeItem("new user");
    //   }
    // } else {
    //   setState((prev) => ({
    //     ...prev,
    //     isLoading: false,
    //     error: "Failed to load user data",
    //     isAuthenticated: false,
    //   }));
    // }

    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (data?.session) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: null,
            isAuthenticated: true,
            user: data.session.user as unknown as User,
          }));
          localStorage.setItem("user", JSON.stringify(data.session.user));
        }
      } catch (err: any) {
        console.error("Session error:", err);
      } finally {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: null,
        }));
      }
    };
    checkUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: null,
        isAuthenticated: true,
        user: (session?.user as unknown as User) || null,
      }));
      if (session?.user) {
        localStorage.setItem("user", JSON.stringify(session.user));
      } else {
        localStorage.removeItem("user");
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const registerUser = useCallback(
    async (newuser: User) => {
      const { username, email, password } = newuser;
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        // const response = await axios.post(`${API_KEY}/users/register`, newuser);
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              username: username,
              isAdmin: false,
              role: "user",
            },
          },
        });
        if (error) {
          setState({
            user: null,
            isLoading: false,
            error: error.message,
            isAuthenticated: false,
          });
          alert(error.message);
        }
        // const { token, user } = response.data;
        else if (data.user) {
          setState({
            user: data.user as unknown as User,
            isLoading: false,
            error: null,
            isAuthenticated: true,
          });
          setUsers((prev) => [data.user as unknown as User, ...prev]);
          localStorage.setItem("user", JSON.stringify(data.user));
          // toast.success("Check your email for confirmation link!");
          router.push("/login");
        }
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Registration error",
        }));
      }
    },
    [router],
  );

  const login = useCallback(
    async (user: User) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        // const response = await axios.post(`${API_KEY}/users/login`, user);
        const { email, password } = user;
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (error) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: error.message,
            isAuthenticated: false,
          }));
          return;
        } else {
          setState({
            user: data.user as unknown as User,
            isLoading: false,
            error: null,
            isAuthenticated: true,
          });
          localStorage.setItem("user", JSON.stringify(data.user));
          data.user?.role === "admin"
            ? router.push("/admin/dashboard")
            : router.push("/");
        }
        // if (response.status === 200) {
        // const { token, user: loggedInUser } = response.data;

        // localStorage.setItem("token", token);

        // //sAdmin === true
        //     ? router.push("/admin/dashboard")
        //     : router.push("/");
        // } else if (response.status === 400) {
        //   setState((prev) => ({
        //     ...prev,
        //     isLoading: false,
        //     error: "this email does not exist",
        //     isAuthenticated: false,
        //   }));
        // } else {
        // setState((prev) => ({
        //   ...prev,
        //   isLoading: false,
        //   error: "Login failed",
        //   isAuthenticated: false,
        // }));
        // }
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Login error",
          isAuthenticated: false,
        }));
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    },
    [router],
  );
  const loginWithFacebook = useCallback(async () => {
    try {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: null,
      }));
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: `${window.location.origin}/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        error: err.message,
      }));
      console.error("Facebook login error:", err);
    } finally {
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, []);
  const loginWithGoogle = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/callback`,
          queryParams: {
            role: "user",
          },
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Google login error",
        isAuthenticated: false,
      }));
      console.error("Google login error:", err);
    } finally {
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, []);
  const updateUserData = useCallback(async (id: string, formdata: any) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const dataToSend = { ...formdata };
      const validationData = formSchema.safeParse(formdata);

      if (!validationData.success) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Invalid data",
        }));
        toast.error("Invalid data");
        return;
      }

      if (!dataToSend.password || dataToSend.password.trim() === "") {
        delete dataToSend.password;
      }

      if (!dataToSend.username || !dataToSend.username.trim()) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Username is required",
        }));
        toast.error("Username is required");
        return;
      }

      if (!dataToSend.email || !dataToSend.email.trim()) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Email is required",
        }));
        toast.error("Email is required");
        return;
      }

      const updatePayload: any = {
        email: dataToSend.email,
        data: {
          username: dataToSend.username,
          phone: dataToSend.phone || "",
        },
      };

      if (dataToSend.password) {
        updatePayload.password = dataToSend.password;
      }

      const { data, error } = await supabase.auth.updateUser(updatePayload);
      const { data: tableData, error: tableError } = await supabase
        .from("User") // ← Your table name
        .update({
          username: dataToSend.username,
          email: dataToSend.email,
          phone: dataToSend.phone || null,
        })
        .eq("id", id);
      if (error) {
        console.error("Update error:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message,
        }));
        toast.error(error.message);
        return;
      } else {
        const updatedUser: User = {
          ...data.user,
          user_metadata: {
            ...data.user.user_metadata,
            username: dataToSend.username,
          },
        } as unknown as User;

        toast.promise<{ name: string }>(
          () =>
            new Promise((resolve) =>
              setTimeout(() => resolve({ name: " account info" }), 2000),
            ),
          {
            loading: "updating...",
            success: (data: { name: string }) => {
              setState((prev) => ({
                ...prev,
                isLoading: false,
                error: null,
                isAuthenticated: true,
                user: updatedUser,
              }));
              localStorage.setItem("user", JSON.stringify(updatedUser));
              setUsers((prev) =>
                prev.map((u) => (String(u.id) === id ? updatedUser : u)),
              );

              return `${data.name} has been updated`;
            },
            error: (data) => `${data.name} couldn't be deleted`,
            position: "top-center",
          },
        );
        return updatedUser;
      }
    } catch (err: any) {
      console.error("❌ Update error:", err);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message || "Update error",
      }));
      toast.error(err.message || "Failed to update profile");
    }
  }, []);
  const deleteAccount = useCallback(
    async (id: string) => {
      try {
        // const res = await axios.delete(`${API_KEY}/users/profile/${id}`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        const { error: authError } = await supabase.auth.admin.deleteUser(id);
        const result = await deleteUserAccount(id);
        toast.promise<{ name: string }>(
          () =>
            new Promise((resolve) =>
              setTimeout(() => resolve({ name: "Account" }), 2000),
            ),
          {
            loading: "Deleting...",
            success: async (data: { name: string }) => {
              setState((prev) => ({
                ...prev,
                isLoading: false,
                error: null,
                isAuthenticated: false,
                user: null,
              }));
              await supabase.auth.signOut();
              localStorage.removeItem("user");
              setUsers((prev) => prev.filter((u) => String(u.id) !== id));

              router.push("/");
              return `${data.name} has been deleted`;
            },
            error: (data) => `${data.name} couldn't be deleted`,
            position: "top-center",
          },
        );
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "couldn't delete user",
          isAuthenticated: true,
        }));
      }
    },
    [router],
  );
  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setState({
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
      });
      // localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/");
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Logout error",
        isAuthenticated: true,
      }));
    }
  }, [router]);
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
      updateUserData,
      deleteAccount,
      loginWithGoogle,
      loginWithFacebook,
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
      updateUserData,
      deleteAccount,
      loginWithGoogle,
      loginWithFacebook,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
