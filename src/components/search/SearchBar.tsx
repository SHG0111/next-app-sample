"use client";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GrClose } from "react-icons/gr";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchQuery.trim() &&
      router.push(`/searchResult?q=${encodeURIComponent(searchQuery.trim())}`);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center  border-black border-2 ">
          <Input
            name="search"
            id="search"
            placeholder="Try pants"
            type="text"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            className="rounded-none h-11 focus-visible:ring-0  border-none placeholder:text-slate-300"
          />

          <button
            type="button"
            className={`mr-2  `}
            onClick={() => setSearchQuery("")}
          >
            <GrClose className={`${searchQuery ? "visible" : "opacity-0"}`} />
          </button>
          <button
            type="submit"
            className={`mr-2  `}
            onClick={() => handleSubmit}
          >
            <SearchIcon />
          </button>
        </div>
      </form>
    </>
  );
};

export default Search;
