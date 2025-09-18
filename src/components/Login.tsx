"use client";
import { Button, Input } from "@heroui/react";
import Image from "next/image";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoEyeSharp } from "react-icons/io5";
import { HiMiniEyeSlash } from "react-icons/hi2";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const formSchema = z.object({
    staffid: z
      .string()
      .min(1, { message: "Minimum of 1 character" })
      .max(100, { message: "Maximum of 100 character" }),
    password: z
      .string()
      .min(4, { message: "Minimum of four character" })
      .max(30, { message: "Maximum of thirty character" }),
  });
  type formSchemaType = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
  });
  const submit = async (value: formSchemaType) => {
    setLoading(true);
    try {
      const { staffid, password } = value;
      const request = await signIn("credentials", {
        staffid,
        password,
        redirect: false,
      });
      if (request?.ok === true) {
        toast.success("login successfully");
        setLoading(false);
        return router.push("/user");
      } else if (request?.error === "CredentialsSignin") {
        toast.error("invalid login credentials");
      } else {
        toast.error("error when tring to login");
      }
      reset();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full py-10 flex h-screen flex-col justify-center items-center">
      <div className="md:w-2/6 bg-white border-2 border-emerald-700 rounded-lg p-5 py-5">
        <Image
          src={"/ayede-logo2.png"}
          alt="Ayede"
          width={50}
          height={50}
          className="w-auto h-auto mx-auto"
          priority
          quality={95}
        />
        <h1 className="text-center font-semibold text-emerald-700">Login</h1>
        <p className="text-center text-[0.6rem] text-emerald-700">
          Note 1: Login with ur Staff ID and password used when registering
        </p>

        <form
          onSubmit={handleSubmit(submit)}
          className="flex flex-col gap-5 mt-5"
        >
          <Input
            errorMessage={errors.staffid?.message}
            isInvalid={!!errors.staffid}
            {...register("staffid")}
            label={"Staff ID"}
            type="text"
            placeholder="Staff ID"
          />
          <Input
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
            {...register("password")}
            label={"Password"}
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            endContent={
              <div
                className="cursor-pointer"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <HiMiniEyeSlash color="black" />
                ) : (
                  <IoEyeSharp color="black" />
                )}
              </div>
            }
          />
          {loading ? (
            <Button
              type="button"
              disabled={true}
              className="bg-emerald-700/90 text-white w-full h-12 mt-12 text-lg"
              isLoading
            >
              Processing...
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-emerald-700 text-white w-full h-12 mt-12 text-lg"
            >
              Login
            </Button>
          )}
        </form>
      </div>
      <h1 className="text-emerald-700 text-end text-[0.7rem] mt-2">
        Dont have an account?
        <Link
          className="font-semibold underline underline-offset-2 italic"
          href={"/register"}
        >
          Register
        </Link>
      </h1>
    </div>
  );
};

export default Login;
