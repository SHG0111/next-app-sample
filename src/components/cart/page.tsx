"use client";

import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingCart, Minus, Plus, X, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import useCart from "@/app/hooks/useCart";
import { toast } from "sonner";

const Cart = () => {
  const { cart, cartTotal, removeFromCart, updateQuantity } = useCart();
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4 min-w-[300px]">
        <ShoppingCart size={48} className="text-gray-300" />
        <p className="text-sm text-muted-foreground">Your cart is empty</p>
        <Button asChild className="box-bg" size="sm">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col   h-[380px] min-w-[300px]">
      <div className="flex items-center justify-between  pb-4">
        <h3 className="font-semibold text-lg capitalize">your cart</h3>
        <span className="text-xs text-muted-foreground">
          {cart.length} items
        </span>
      </div>
      <ScrollArea className=" -mx-2 px-2 h-[200px] ">
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 group bg-white px-3 items-center min-h-32"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden ">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between py-0.5">
                <div className="grid gap-1 ">
                  <h4 className="text-sm font-medium text-gray-700 break-all max-w-xs">
                    {item.title}
                  </h4>
                  <div className="text-sm text-black  border-gray-300 border-2 w-fit mt-2 mb-2 flex items-center">
                    <button
                      className="ghost hover:bg-gray-300 px-2 py-2  transition-all"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus strokeWidth={1} size={15} />
                    </button>
                    <span className="px-2">
                      {String(item.quantity).padStart(2, "0")}
                    </span>
                    <button
                      className="ghost hover:bg-gray-300 px-2 py-2 transition-all"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus strokeWidth={1} size={15} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">
                    ${item.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => {
                      toast.warning(
                        "Are you sure you want to delete this product ?",
                        {
                          position: "top-center",

                          cancel: {
                            label: "Cancel",
                            onClick: () => console.log("Cancel!"),
                          },
                          action: {
                            label: "Delete",
                            onClick: () => {
                              toast.promise<{ name: string }>(
                                () =>
                                  new Promise((resolve) =>
                                    setTimeout(
                                      () => resolve({ name: "product" }),
                                      2000,
                                    ),
                                  ),
                                {
                                  loading: "Deleting...",
                                  success: async (data: { name: string }) => {
                                    removeFromCart(item.id);

                                    return `${data.name} has been deleted`;
                                  },
                                  error: (data) =>
                                    `${data.name} couldn't be deleted`,
                                  position: "top-center",
                                },
                              );
                            },
                          },
                        },
                      );
                    }}
                    className="text-black text-sm hover:text-red-500 transition-colors flex justify-end items-center capitalize"
                  >
                    <Trash strokeWidth={1} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="pt-4 space-y-4">
        <Separator />
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">${cartTotal.toFixed(2)}</span>
          </div>{" "}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">Free</span>
          </div>
        </div>
        <Button className="w-full box-bg h-11 " size="sm" asChild>
          <Link href="/checkout">Checkout</Link>
        </Button>
      </div>
    </div>
  );
};

export default Cart;
