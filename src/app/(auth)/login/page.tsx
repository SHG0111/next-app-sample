"use client";
import useAuth from "@/app/hooks/useAuth";
import { User } from "@/utils/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { is } from "zod/v4/locales";
const Login = () => {
  const router = useRouter();
  const { login, isAuthenticated, error, user } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [isAuthenticated, user, router]);
  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const user: User = {
      email: email,
      password: password,
    };
    email.length === 0 &&
      password.length === 0 &&
      toast.error("please enter email and password");
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      toast.error("please enter valid email");
    } else {
      login(user);
      // const saveduser = JSON.parse(localStorage.getItem("user") || "{}");

      // saveduser.isAdmin === true && router.push("/admin/dashboard");
      !isAuthenticated && error && toast.error(error);
      // !error && router.push("/products");
    }
  };
  return (
    <>
      <div className=" h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-4xl font-light  capitalize ">welcome back</h2>
        <div className="mb-8 mt-2">
          Don&apos;t have account?{" "}
          <Link href="/register" className="text-red-600">
            Register
          </Link>
        </div>
        <div className="flex items-center justify-center ">
          <div className="bg-black p-8 w-96 h-96 flex  items-center justify-center">
            <form className="" onSubmit={handleSubmit} method="POST" action="">
              <div className=" ">
                <input
                  type="email"
                  placeholder="enter your email"
                  className="p-3 w-full   bg-zinc-800 text-white "
                  name="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                  }}
                />
                <input
                  type="password"
                  placeholder="password"
                  className="p-3 w-full my-5 bg-zinc-800 text-white "
                  name="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                  }}
                />
                <button
                  type="submit"
                  className=" box-bg box-bg-inverse  w-full mt-5"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
