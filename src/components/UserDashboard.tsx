"use client";
import { Button } from "@heroui/react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaArrowRightToBracket } from "react-icons/fa6";

const UserDashboard = () => {
  const { data: session } = useSession();

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="md:w-2/6 bg-white w-full border-2 border-emerald-700 rounded-lg p-5 py-5">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-center text-emerald-700 font-semibold">
            Dashboard
          </h1>
          <Button
            onPress={() => signOut()}
            size="sm"
            className="bg-red-700 text-white"
          >
            <FaArrowRightToBracket className="mr-1" />
            Logout
          </Button>
        </div>
        <div className="w-full h-auto p-6 flex flex-row gap-8 mt-5 bg-emerald-50 shadow-md shadow-black rounded-lg">
          <Image
            src={
              session?.user.image ??
              "https://i.pinimg.com/736x/2b/2f/2b/2b2f2b2e25e3e79562840725bfb03df8.jpg"
            }
            alt="user"
            width={60}
            height={60}
            className="w-16 h-16 rounded-full"
            priority
          />
          <div>
            <h1 className="text-sm font-semibold text-emerald-800 mb-4">
              {session?.user.staffid}
            </h1>
            <h1 className="text-[0.8rem] text-emerald-800">
              {session?.user.email}
            </h1>
            <h1 className="text-[0.8rem] text-emerald-800">
              {session?.user.name}
            </h1>
          </div>
        </div>
        <div className="flex mt-20 justify-between flex-row">
          <Button
            as={Link}
            href="/user/vote"
            className="border-2 border-emerald-700 font-semibold rounded-md bg-transparent text-emerald-700"
          >
            Vote
          </Button>
          <Button
            as={Link}
            href="/user/result"
            className="bg-emerald-700 text-white rounded-md"
          >
            Check Result
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
