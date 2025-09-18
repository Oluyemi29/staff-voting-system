"use client";
import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const LandingPage = () => {
  const router = useRouter();
  useEffect(() => {
    const TheInterval = setTimeout(() => {
      router.push("/register");
    }, 10000);
    return () => clearTimeout(TheInterval);
  }, [router]);
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="md:w-2/6 bg-white p-5 py-10 w-full border-2 border-emerald-700 rounded-lg ">
        <h1 className="text-center text-emerald-700 text-lg font-bold">
          Welcome
        </h1>
        <p className=" text-center text-emerald-700 text-medium font-bold">
          to
        </p>
        <h1 className="text-center text-emerald-700 text-lg font-bold">
          Staff Voting Platform
        </h1>
        <Image
          src={"/ayede-logo2.png"}
          alt="Ayede"
          width={100}
          height={100}
          className="mx-auto w-60 h-60"
        />
        <h1 className="text-emerald-700 text-2xl font-bold text-center">
          Federal Polytechnic Ayede
        </h1>
        <Button
          as={Link}
          href="/register"
          className="bg-emerald-700 md:h-12 h-12 text-white mx-auto w-full my-5 text-medium font-semibold"
        >
          Let Go
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
