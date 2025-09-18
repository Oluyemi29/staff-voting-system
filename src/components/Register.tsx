"use client";
import { Button, Input } from "@heroui/react";
import Image from "next/image";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterUser } from "@/app/api/Action";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoEyeSharp } from "react-icons/io5";
import { HiMiniEyeSlash } from "react-icons/hi2";

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [preview, setPreview] = useState<string>(
    "https://i.pinimg.com/736x/2b/2f/2b/2b2f2b2e25e3e79562840725bfb03df8.jpg"
  );
  const [imageUploaded, setImageUploaded] = useState<File | string>("");
  const formSchema = z.object({
    name: z
      .string()
      .min(2, { message: "Minimum of two character" })
      .max(100, { message: "Maximum of hundred character" }),
    email: z.string().email({ message: "Invalid email address" }),
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
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      setPreview(URL.createObjectURL(files[0]));
      setImageUploaded(files[0]);
    }
  };
  const GetImageLink = async () => {
    const imageData = new FormData();
    imageData.append("file", imageUploaded);
    imageData.append("folder", "ayede");
    imageData.append("upload_preset", "votingsite");
    const request = await fetch(
      "https://api.cloudinary.com/v1_1/devoluyemi/image/upload",
      {
        method: "POST",
        body: imageData,
      }
    );
    const response = await request.json();
    return response.secure_url as string;
  };
  const submit = async (value: formSchemaType) => {
    setLoading(true);
    try {
      const { email, staffid, name, password } = value;
      const myImage = await GetImageLink();
      if (!myImage) {
        toast.error("All field are required");
        return;
      }
      const response = await RegisterUser({
        email,
        staffid,
        name,
        password,
        image: myImage,
      });
      if (response.success === true) {
        toast.success(response.message);
        return router.push("/login");
      } else {
        toast.error(response.message);
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
        <h1 className="text-center font-semibold text-emerald-700">Register</h1>
        <p className="text-center text-[0.6rem] text-emerald-700">
          Note 1: Information use to Register will be needed when the election
          start
        </p>
        <p className="text-center text-[0.6rem] text-emerald-700">
          Note 2: Your Staff ID must correct as it must be unique
        </p>
        <div className="h-80 overflow-y-scroll">
          <form
            onSubmit={handleSubmit(submit)}
            className="flex flex-col gap-5 my-5"
          >
            <label className="w-max mx-auto cursor-pointer">
              <Image
                src={preview}
                alt="user"
                width={100}
                height={100}
                className="w-20 h-20 rounded-full border-2 border-emerald-700 p-1"
                priority
                quality={95}
              />
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleImage(e)
                }
                type="file"
                accept=".jpg, .png"
                hidden
                name=""
                id=""
              />
            </label>
            <Input
              errorMessage={errors.name?.message}
              isInvalid={!!errors.name}
              {...register("name")}
              label={"Name"}
              type="text"
              placeholder="Name"
            />
            <Input
              errorMessage={errors.email?.message}
              isInvalid={!!errors.email}
              {...register("email")}
              label={"Email"}
              type="email"
              placeholder="Email"
            />
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
              placeholder="Password"
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
                Register
              </Button>
            )}
          </form>
        </div>
      </div>
      <h1 className="text-emerald-700 text-end text-[0.7rem] mt-2">
        Already have an account?
        <Link
          className="font-semibold underline underline-offset-2 italic"
          href={"/login"}
        >
          Login
        </Link>
      </h1>
    </div>
  );
};

export default Register;
