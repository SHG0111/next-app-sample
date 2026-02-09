"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    email.length === 0 &&
      password.length === 0 &&
      toast.error("please enter email and password");
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      toast.error("please enter valid email");
    }

    if (password.length < 8) {
      toast.error("At least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("One uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      toast.error("One lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      toast.error("One number");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      toast.error("One special character (!@#$%^&*)");
    } else {
      router.push("/user");
    }
  };
  return (
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-lg shadow-slate-200 p-8 w-96 h-96 flex  items-center justify-center">
        <form className="" onSubmit={handleSubmit} method="POST" action="">
          <div className=" ">
            <input
              type="email"
              placeholder="123@example.com"
              className="p-3 w-full my-5 bg-blue-20"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="password"
              placeholder="password"
              className="p-3 w-full my-5 bg-blue-20"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button type="submit" className=" box-bg">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
