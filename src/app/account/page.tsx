"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useAuth from "../hooks/useAuth";
import { Card } from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarBadge,
  AvatarImage,
} from "@/components/ui/avatar";
import { DeleteIcon, Trash, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase/client";
import { useRouter } from "next/navigation";
import { set } from "zod";

export default function Account() {
  const { updateUserData, deleteAccount } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const router = useRouter();
  useEffect(() => {
    const currentuser = JSON.parse(localStorage.getItem("user") as string);
    const loadUser = async () => {
      if (currentuser) {
        setUser(currentuser);
        setFormData({
          username:
            (user?.user_metadata?.username as string) ||
            user?.user_metadata.name ||
            "",
          email: user?.new_email || user?.user_metadata?.email || "",
          phone: (user?.user_metadata?.phone as any) || "",
          password: "",
        });
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
      }
    };
    loadUser();
  }, [
    router,
    user?.new_email,
    user?.user_metadata?.email,
    user?.user_metadata?.phone,
    user?.user_metadata?.username,
    user?.user_metadata?.name,
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    user?.id &&
      updateUserData(
        user.id as string,
        formData as any,
        // localStorage.getItem("token") as any,
      );
  };
  return (
    <div>
      <div className="mt-5 pb-6 pt-6 px-4 w-full max-w-3xl mx-auto flex justify-between bg-slate-50 gap-3 items-center">
        <div className="flex justify-start items-center gap-3">
          <Avatar className="  w-20 h-20    ">
            <AvatarImage
              src={
                user?.user_metadata?.picture || "https://github.com/shadcn.png"
              }
              alt="shadcn"
            />
            <AvatarFallback>
              {user?.user_metadata?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="col-span-2">
            <div className="capitalize  ">
              {user?.user_metadata?.username || user?.user_metadata?.name}
            </div>
            <div className=" opacity-50">
              {user?.new_email || user?.user_metadata?.email}
            </div>
          </div>{" "}
        </div>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  toast.warning(
                    "Are you sure you want to delete your account?",
                    {
                      position: "top-center",

                      cancel: {
                        label: "Cancel",
                        onClick: () => console.log("Cancel!"),
                      },
                      action: {
                        label: "Delete",
                        onClick: () => {
                          deleteAccount(user?.id as string);
                        },
                      },
                    },
                  );
                }}
                className="hover:bg-red-600 bg-black opacity-20 hover:opacity-100 transition-all duration-300 text-white rounded-full w-10 h-10 flex justify-center items-center"
              >
                <Trash2 />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="capitalize">delete account</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className=" flex justify-center items-center ">
        <Card className="w-full max-w-3xl my-auto  capitalize p-4 mx-auto shadow-none rounded-none border-black border-2">
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>your account </FieldLegend>
                <FieldDescription>
                  edit your account information
                </FieldDescription>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="username">username</FieldLabel>
                      <Input
                        id="username"
                        name="username"
                        placeholder="enter your name"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="border-2 border-black h-11 rounded-none px-2"
                      />
                      <FieldDescription>enter your name</FieldDescription>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="email">email</FieldLabel>
                      <Input
                        id="email"
                        name="email"
                        placeholder="example@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border-2 border-black h-11 rounded-none px-2"
                      />
                      <FieldDescription>
                        Enter your email address
                      </FieldDescription>
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="phone">phone number</FieldLabel>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+20 1278678637"
                        type="number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="border-2 border-black h-11 rounded-none px-2"
                      />
                      <FieldDescription>
                        Enter your phone number
                      </FieldDescription>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="password">
                        change password
                      </FieldLabel>
                      <Input
                        id="password"
                        placeholder="●●●●●●●●●●●●●"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="border-2 border-black h-11 rounded-none px-2"
                      />
                      <FieldDescription>
                        change your password if you want to change it
                      </FieldDescription>
                    </Field>
                  </FieldGroup>
                </div>
              </FieldSet>
              <FieldSeparator />

              <Field orientation="horizontal" className="justify-end">
                <Button variant="outline" type="button" className="box   ">
                  Cancel
                </Button>
                <Button type="submit" className="box box-bg">
                  save changes
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </Card>
      </div>
    </div>
  );
}
