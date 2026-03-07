"use client";
import Link from "next/link";
import styles from "@/components/header/header.module.css";
import Navbar from "@/components/navbar/Navbar";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import Search from "../search/SearchBar";
import Image from "next/image";
import useAuth from "@/app/hooks/useAuth";
import {
  Avatar,
  AvatarFallback,
  AvatarBadge,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BadgeCheckIcon,
  BellIcon,
  ChevronDown,
  CreditCardIcon,
  LogOutIcon,
  ShoppingBag,
} from "lucide-react";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, loading, logout } = useAuth();

  return (
    <header className="sticky top-0 bg-white/95 w-full backdrop-blur-sm shadow-sm z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="grid grid-flow-row-dense grid-cols-2  items-center">
          <Link href={"/"} className="flex-none">
            <Image
              src="/logo.png"
              alt="logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </Link>

          <button
            className=" md:hidden "
            onClick={() => {
              setIsOpen(!isOpen);
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

          <div className="hidden md:flex items-center space-x-4  w-full col-span-1">
            <Search />
            <nav className="hidden md:visible md:flex items-center space-x-5 flex-initial">
              <Navbar />
            </nav>
            {!loading && (
              <>
                {!user && !isAuthenticated && (
                  <>
                    <button className="px-4 py-2 ghost box">
                      {" "}
                      <Link href="/login" className="relative z-10">
                        Login
                      </Link>
                    </button>
                    <button className="px-4 py-2 ghost box">
                      {" "}
                      <Link href="/register" className="relative z-10">
                        register
                      </Link>
                    </button>
                  </>
                )}
                {user && isAuthenticated && (
                  <>
                    <Link href="/cart" className="relative z-10">
                      <Avatar className=" rounded-none">
                        <ShoppingBag size={40} strokeWidth={1} />
                        <AvatarBadge count={5} variant="error"></AvatarBadge>
                      </Avatar>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="rounded-full px-0">
                          <Avatar>
                            <AvatarImage
                              src="https://github.com/shadcn.png"
                              alt="shadcn"
                            />
                            <AvatarFallback>
                              {user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>{user.username}</div>
                          <ChevronDown />{" "}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel className="px-2 py-1 capitalize font-bold"></DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Link href="/profile">Orders</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href="/profile">Account</Link>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <button
                            className="flex items-center gap-2"
                            onClick={logout}
                          >
                            <LogOutIcon size={16} />
                            Sign Out
                          </button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
