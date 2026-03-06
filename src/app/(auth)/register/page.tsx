"use client";
import useAuth from "@/app/hooks/useAuth";
import { User } from "@/utils/lib/types";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
const Registerpage = () => {
  const { registerUser, users } = useAuth();
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
        id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1, // Generate a new ID based on existing users
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };
      registerUser(user);
      router.push("/");
    } catch (err) {
      console.error("Registration error:", err);
    }
  };
  return (
    <div className=" h-screen flex flex-col items-center justify-center text-center">
      <h2 className="text-4xl font-black mb-8 capitalize ">Join us</h2>
      <div className="bg-black p-8 w-96 h-96 flex  items-center justify-center">
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
            className="p-3 w-full   bg-zinc-800 text-white capitalize"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="p-3 w-full   bg-zinc-800 text-white capitalize"
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
            className="p-3 w-full   bg-zinc-800 text-white capitalize"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <button type="submit" className=" box-bg box-bg-inverse  w-full mt-5">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registerpage;
