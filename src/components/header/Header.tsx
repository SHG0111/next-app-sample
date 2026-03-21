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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearchParams } from "next/navigation";
import { get } from "http";
import Cart from "../cart/page";
import useCart from "@/app/hooks/useCart";
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, loading, logout } = useAuth();
  const user = JSON.parse(localStorage.getItem("user") as string);
  const role = localStorage.getItem("userRole") as string;
  const { cartCount } = useCart();

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

          <div className="hidden md:flex items-center space-x-4  w-full col-span-1 justify-end">
            <Search />
            <nav className="hidden md:visible md:flex items-center space-x-5 flex-initial">
              <Navbar />
            </nav>
            {loading === true ? (
              ""
            ) : (
              <>
                {isAuthenticated === false || user === null ? (
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
                ) : (
                  <>
                    {role === "user" && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="ghost">
                            <Avatar className=" rounded-none">
                              <ShoppingBag size={35} strokeWidth={1} />
                              {cartCount > 0 && (
                                <AvatarBadge
                                  count={cartCount}
                                  variant="error"
                                ></AvatarBadge>
                              )}
                            </Avatar>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="start"
                          className="w-full border-none rounded-none bg-gray-50"
                        >
                          <Cart />
                        </PopoverContent>
                      </Popover>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="rounded-full px-0">
                          <Avatar className="w-8 h-8 ">
                            <AvatarImage
                              src={
                                user?.user_metadata?.picture ||
                                "https://github.com/shadcn.png"
                              }
                              alt="shadcn"
                            />
                            <AvatarFallback>
                              {user?.user_metadata.username
                                ?.charAt(0)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <ChevronDown />{" "}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel className=" mb-4 mt-2 px-2 flex justify-center gap-1 items-center">
                          <Avatar className="col-span-0  w-9 h-9 self-center   ">
                            <AvatarImage
                              src={
                                user?.user_metadata?.picture ||
                                "https://github.com/shadcn.png"
                              }
                              alt="shadcn"
                            />
                            <AvatarFallback>
                              {user?.user_metadata.username
                                ?.charAt(0)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="col-span-2">
                            <div className="capitalize  truncate text-nowrap w-40">
                              {user?.user_metadata.username ||
                                user?.user_metadata.name}
                            </div>
                            <div className="text-xs opacity-50">
                              {user?.new_email || user?.user_metadata.email}
                            </div>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Link
                            href="/orders"
                            className="capitalize opacity-50 hover:opacity-100 transition-all duration-300"
                          >
                            Orders History
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            href="/account"
                            className="capitalize opacity-50 hover:opacity-100 transition-all duration-300"
                          >
                            {" "}
                            my Account
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <button
                            className="flex items-center gap-2 capitalize opacity-50 hover:opacity-100 transition-all duration-300"
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
