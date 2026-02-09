"use client";
import Link from "next/link";
import styles from "@/components/header/header.module.css";
import Navbar from "@/components/navbar/Navbar";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-white/95 w-full backdrop-blur-sm shadow-sm z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href={"/"}>
            <span className="text-2xl font-bold text-gray-600">
              shahenda galal
            </span>
          </Link>

          <nav className="hidden md:visible md:flex items-center space-x-8 flex-initial">
            <Navbar />
          </nav>
          <button
            className=" md:hidden "
            onClick={() => {
              setIsOpen(!isOpen);
              console.log(isOpen);
            }}
          >
            {isOpen ? (
              <>
                <IoClose size={24} className=" text-gray-600" />
              </>
            ) : (
              <>
                <HiOutlineMenuAlt2 size={24} className=" text-gray-600" />
              </>
            )}
          </button>
          {isOpen && (
            <div className="md:hidden    fixed top-16 pt-10 pl-10 left-0 transition-all ease-in-out duration-500 w-48 bottom-0 h-screen bg-white/95 backdrop-blur-md shadow-md z-50   items-center space-x-8 flex-initial">
              <nav className=" flex flex-col items-start space-y-8 ">
                <Navbar />
              </nav>
            </div>
          )}

          <div className="hidden md:flex items-center space-x-4">
            <button className="px-4 py-2 ghost box">
              {" "}
              <Link href="/login" className="relative z-10">
                Login
              </Link>
            </button>
            <button className="px-4 py-2 ghost box">
              {" "}
              <Link href="/login" className="relative z-10">
                register
              </Link>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
