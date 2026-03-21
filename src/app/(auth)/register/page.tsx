"use client";
import useAuth from "@/app/hooks/useAuth";
import { User } from "@/utils/lib/types";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { GrGoogle } from "react-icons/gr";
const Registerpage = () => {
  const { registerUser, users, loginWithGoogle, loading } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const handleRegistration = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);
      const user: User = {
        id: users.length > 0 ? Number(...users.map((u) => u.id)) + 1 : 1, //    // Generate a new ID based on existing users
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        isAdmin: false, // Default to non-admin
      };
      registerUser(user);
    } catch (err) {
      console.error("Registration error:", err);
    }
  };
  return (
    <div className=" h-screen flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-light mb-8 capitalize ">
        {" "}
        Create your account to access exclusive deals and seamless shopping
      </h2>
      <div className="bg-sky-50 p-8 w-96  flex  items-center justify-center">
        <form
          className="flex flex-col gap-4 w-full max-w-md mx-auto "
          method="POST"
          action=""
          onSubmit={handleRegistration}
        >
          <input
            type="text"
            name="username"
            placeholder="your Name"
            required
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, username: e.target.value }))
            }
            className="p-3 w-full    "
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="p-3 w-full    "
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="p-3 w-full    "
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <button type="submit" className=" box-bg box-bg-inverse  w-full mt-5">
            Register
          </button>
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sky-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-300">Or</span>
            </div>
          </div>
          <button
            onClick={loginWithGoogle}
            disabled={loading}
            className="w-full box-bg"
          >
            {loading ? (
              "Loading..."
            ) : (
              <div className="flex items-center justify-center">
                <GrGoogle className="mr-2" /> Continue with Google
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registerpage;
