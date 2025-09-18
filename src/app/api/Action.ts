"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

type RegisterProps = {
  name: string;
  email: string;
  staffid: string;
  password: string;
  image: string;
};

export const RegisterUser = async ({
  email,
  staffid,
  name,
  password,
  image,
}: RegisterProps) => {
  try {
    if (
      !email ||
      !staffid ||
      !name ||
      !password ||
      !image
    ) {
      return {
        success: false,
        message: "All field are required",
      };
    }
    const existUser = await prisma.user.findUnique({
      where: {
        staffid,
      },
    });
    if (existUser) {
      return {
        success: false,
        message: "User Already Registered",
      };
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        image,
        email,
        staffid,
        name,
        password: hashPassword,
      },
    });
    revalidatePath("/");
    return {
      success: true,
      message: "user register successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "an error occured",
    };
  }
};

type AdminRegisterProps = {
  name: string;
  email: string;
  password: string;
};

export const AdminRegistering = async ({
  email,
  name,
  password,
}: AdminRegisterProps) => {
  try {
    if (!email || !name || !password) {
      return {
        success: false,
        message: "All field are required",
      };
    }
    const AdminExist = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });
    if (AdminExist) {
      return {
        success: false,
        message: "Admin already exist",
      };
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await prisma.admin.create({
      data: {
        email,
        name,
        password: hashPassword,
      },
    });

    revalidatePath("/");
    return {
      success: true,
      message: "admin register successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "an error occured",
    };
  }
};

type EditUserProps = {
  name: string;
  email: string;
  staffid: string;
  password: string;
};

export const EditUser = async ({
  name,
  email,
  staffid,
  password,
}: EditUserProps) => {
  try {
    if (!email || !staffid || !name || !password ) {
      return {
        success: false,
        message: "All field are required",
      };
    }
    const existUser = await prisma.user.findUnique({
      where: {
        staffid,
      },
    });
    if (!existUser) {
      return {
        success: false,
        message: "User Not Found",
      };
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: {
        staffid,
      },
      data: {
        name,
        email,
        password: hashPassword,
      },
    });
    revalidatePath("/admin", "page");
    return {
      success: true,
      message: "user edited successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "an error occured",
    };
  }
};

export const DeleteUser = async (id: string) => {
  if (!id) {
    return {
      success: false,
      message: "All field are required",
    };
  }
  await prisma.user.delete({
    where: {
      id,
    },
  });
  // revalidatePath('/', 'layout')
  revalidatePath("/admin", "page");
  revalidatePath("/user");
  return {
    success: true,
    message: "User deleted successfully",
  };
};

type CreateElectionProps = {
  election: string;
  description: string;
  startTime: Date;
  endTime: Date;
};

export const CreateElectionInfo = async ({
  election,
  description,
  endTime,
  startTime,
}: CreateElectionProps) => {
  try {
    if (!election || !description || !endTime || !startTime) {
      return {
        success: false,
        message: "All field are required",
      };
    }
    await prisma.election.create({
      data: {
        title: election,
        description,
        startTime,
        endTime,
      },
    });
    revalidatePath("/");
    return {
      success: true,
      message: "Election Name Registered Successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error when registering election name",
    };
  }
};

export const GetAllElection = async () => {
  const request = await prisma.election.findMany({
    select: {
      title: true,
      id: true,
    },
  });
  return request;
};

type PositionProps = {
  position: string;
  electionId: string;
};

export const CreatePosition = async ({
  position,
  electionId,
}: PositionProps) => {
  try {
    if (!position || !electionId) {
      return {
        success: false,
        message: "All field are required",
      };
    }
    await prisma.position.create({
      data: {
        name: position,
        electionId,
      },
    });
    revalidatePath("/");
    return {
      success: true,
      message: "Position created successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Eror when creating Position",
    };
  }
};

export const GetAllPostion = async () => {
  const request = await prisma.position.findMany({
    select: {
      name: true,
      electionId: true,
      id: true,
    },
  });
  return request;
};

type CreateContestantProps = {
  contestantelection: string;
  contestantname: string;
  contestantPositionName: string;
  contestantimage: string;
  contestantPositionId: string;
};

export const CreateContestant = async ({
  contestantelection,
  contestantname,
  contestantPositionName,
  contestantimage,
  contestantPositionId,
}: CreateContestantProps) => {
  try {
    if (
      !contestantelection ||
      !contestantname ||
      !contestantPositionName ||
      !contestantimage ||
      !contestantPositionId
    ) {
      return {
        success: false,
        message: "All field are required",
      };
    }
    await prisma.contestant.create({
      data: {
        image: contestantimage,
        name: contestantname,
        position: contestantPositionName,
        electionId: contestantelection,
        positionId: contestantPositionId,
      },
    });
    revalidatePath("/");
    return {
      success: true,
      message: "Contestant registered successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error when creating contestant",
    };
  }
};

type SubmitSelectedContestantProps = {
  AllSelectedVote: {
    positionId: string;
    contestantId: string;
  }[];
  userId: string;
  electId: string;
};

export const SubmitSelectedContestant = async ({
  AllSelectedVote,
  userId,
  electId,
}: SubmitSelectedContestantProps) => {
  try {
    if (AllSelectedVote.length < 1 || !userId || !electId) {
      return {
        success: false,
        message: "Kindly pick contestant of your choice",
      };
    }
    const checkUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!checkUser) {
      return {
        success: false,
        message: "Unauthorize access",
      };
    }
    AllSelectedVote.map(async (eachSelectedVote) => {
      return await prisma.contestant.update({
        where: {
          positionId: eachSelectedVote.positionId,
          id: eachSelectedVote.contestantId,
        },
        data: {
          vote: { increment: 1 },
        },
      });
    });

    const electionVoters = await prisma.election.findUnique({
      where: {
        id: electId,
      },
      select: {
        userId: true,
      },
    });
    const updateVoters = [...(electionVoters?.userId as string[]), userId];
    await prisma.election.update({
      where: {
        id: electId,
      },
      data: {
        userId: updateVoters as string[],
      },
    });
    revalidatePath("/");
    return {
      success: true,
      message: "Vote Added Successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error when adding vote",
    };
  }
};

export const DeleteElection = async (id: string) => {
  if (!id) {
    return {
      success: false,
      message: "All field are required",
    };
  }
  await prisma.election.delete({
    where: {
      id,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/allelection");
  revalidatePath("/admin/allposition");
  revalidatePath("/admin/allcontestant");
  revalidatePath("/user");
  return {
    success: true,
    message: "Election deleted successfully",
  };
};

type EditElectionProps = {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  id: string;
};

export const EditElection = async ({
  title,
  description,
  startTime,
  endTime,
  id,
}: EditElectionProps) => {
  try {
    if (!title || !description || !startTime || !endTime || !id) {
      return {
        success: false,
        message: "All field are required",
      };
    }
    const existElection = await prisma.election.findUnique({
      where: {
        id,
      },
    });
    if (!existElection) {
      return {
        success: false,
        message: "Election Not Found",
      };
    }
    await prisma.election.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        startTime,
        endTime,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/allelection");
    revalidatePath("/admin/allposition");
    revalidatePath("/admin/allcontestant");
    return {
      success: true,
      message: "election edited successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "an error occured",
    };
  }
};

type EditPositionProps = {
  id: string;
  name: string;
  electionId: string;
};

export const EditPosition = async ({
  id,
  electionId,
  name,
}: EditPositionProps) => {
  try {
    if (!electionId || !name || !id) {
      return {
        success: false,
        message: "All field are required",
      };
    }
    const existposition = await prisma.position.findUnique({
      where: {
        id,
      },
    });
    if (!existposition) {
      return {
        success: false,
        message: "Election Not Found",
      };
    }
    await prisma.position.update({
      where: {
        id,
      },
      data: {
        name,
        electionId,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/allposition");
    revalidatePath("/admin/allcontestant");
    return {
      success: true,
      message: "Position edited successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "an error occured",
    };
  }
};

export const DeletePosition = async (id: string) => {
  try {
    if (!id) {
      return {
        success: false,
        message: "All field are required",
      };
    }
    await prisma.position.delete({
      where: {
        id,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/allposition");
    revalidatePath("/admin/allcontestant");
    revalidatePath("/user");
    return {
      success: true,
      message: "Position deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error when deleting Position",
    };
  }
};

export const DeleteContestant = async (id: string) => {
  try {
    if (!id) {
      return {
        success: false,
        message: "All field are required",
      };
    }
    await prisma.contestant.delete({
      where: {
        id,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/allcontestant");
    revalidatePath("/user");
    return {
      success: true,
      message: "Contestant deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error when deleting contestant",
    };
  }
};

type EditContestantProps = {
  id: string;
  image: string;
  position: string;
  name: string;
  positionId: string;
  electionId: string;
};

export const EditContestant = async ({
  id,
  electionId,
  positionId,
  image,
  name,
  position,
}: EditContestantProps) => {
  try {
    if (!id || !electionId || !positionId || !image || !name || !position) {
      return {
        success: false,
        message: "All field are required",
      };
    }
    const existContestant = await prisma.contestant.findUnique({
      where: {
        id,
      },
    });
    if (!existContestant) {
      return {
        success: false,
        message: "Contestant not found",
      };
    }
    await prisma.contestant.update({
      where: {
        id,
      },
      data: {
        image,
        name,
        position,
        positionId,
        electionId,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/allcontestant");
    revalidatePath("/user");
    return {
      success: true,
      message: "Contestant edited successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "error when editing contestant",
    };
  }
};
