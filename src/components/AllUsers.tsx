"use client";
import { DeleteUser, EditUser } from "@/app/api/Action";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  getKeyValue,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { FaSearch } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";

type AllUsersProps = {
  allUsers: {
    name: string;
    id: string;
    image: string;
    email: string;
    staffid: string;
    password: string;
  }[];
};
type FilterUserProps = {
  name: string;
  id: string;
  image: string;
  email: string;
  staffid: string;
  password: string;
}[];
type EditProps = {
  name: string;
  staffid: string;
  email: string;
};
type DeleteProps = {
  id: string;
  name: string;
  staffid: string;
  email: string;
};
const AllUsers = ({ allUsers }: AllUsersProps) => {
  const [isOpen, setisOpen] = useState(false);
  const [filteredBy, setFilteredBy] = useState({
    name: "Staff ID",
    value: "staffid",
  });
  const [filteredUser, setFilteredUser] = useState<FilterUserProps>(allUsers);
  const [hideSearch, setHideSearch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState({
    visible: false,
    name: "",
    staffid: "",
    email: "",
  });
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    id: "",
    name: "",
    staffid: "",
    email: "",
  });
  const handleSearch = (searchValue: string) => {
    if (filteredBy.value === "staffid") {
      const result = allUsers.filter((eachUser) => {
        return eachUser.staffid
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setFilteredUser(result);
    }
    if (filteredBy.value === "email") {
      const result = allUsers.filter((eachUser) => {
        return eachUser.email.toLowerCase().includes(searchValue.toLowerCase());
      });
      setFilteredUser(result);
    }
    if (filteredBy.value === "name") {
      const result = allUsers.filter((eachUser) => {
        return eachUser.name.toLowerCase().includes(searchValue.toLowerCase());
      });
      setFilteredUser(result);
    }
    if (!filteredBy.value) {
      setFilteredUser(allUsers);
    }
  };
  const rows = filteredUser.map((eachUser, index) => {
    const { id, name, email, staffid } = eachUser;
    const details = {
      key: index,
      name: eachUser.name,
      email: eachUser.email,
      staffid: eachUser.staffid,
      action: (
        <div className="flex flex-row gap-5">
          <Button
            onPress={() => handleEdit({ name, staffid, email })}
            className="bg-emerald-700 text-white text-medium"
          >
            Edit
          </Button>
          <Button
            onPress={() => handleDelete({ id, name, staffid, email })}
            className="bg-red-700 text-white text-medium"
          >
            Delete
          </Button>
        </div>
      ),
    };
    return details;
  });
  const columns = [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "email",
      label: "EMAIL",
    },
    {
      key: "staffid",
      label: "STAFF ID",
    },
    {
      key: "action",
      label: "ACTION",
    },
  ];

  const handleEdit = ({ name, staffid, email }: EditProps) => {
    setEditModal((prevData) => {
      return {
        ...prevData,
        email,
        staffid,
        name,
        visible: true,
      };
    });
  };
  const handleDelete = ({ id, name, staffid, email }: DeleteProps) => {
    setDeleteModal((prevData) => {
      return {
        ...prevData,
        email,
        staffid,
        name,
        id,
        visible: true,
      };
    });
  };

  const formSchema = z.object({
    name: z
      .string()
      .min(2, { message: "Minimum of 2 character" })
      .max(100, { message: "Maximum of 100 character" }),
    email: z.string().email({ message: "Invalid email address" }),
    staffid: z
      .string()
      .min(1, { message: "Minimum of 1 character" })
      .max(100, { message: "Maximum of 100 character" }),
    password: z
      .string()
      .min(4, { message: "Minimum of 4 character" })
      .max(30, { message: "Maximum of 30 character" }),
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
      const { email, staffid, name, password } = value;
      const response = await EditUser({
        name,
        email,
        staffid,
        password,
      });
      if (response.success === true) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      reset();
      setEditModal((prevData) => {
        return {
          ...prevData,
          visible: false,
        };
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const DeleteThisUser = async (id: string) => {
    setDeleteModal((prevData) => {
      return {
        ...prevData,
        visible: false,
      };
    });
    if (!id) {
      toast.error("All field are required");
      return;
    }
    const response = await DeleteUser(id);
    if (response.success === true) {
      toast.success(response.message);
    } else {
      toast.error("error when deleting user");
    }
  };

  const handleFilteredSelected = (name: string, value: string) => {
    setFilteredBy((prevData) => {
      return {
        ...prevData,
        name,
        value,
      };
    });
  };
  return (
    <div>
      {/* Edit Modal */}
      <Modal
        isOpen={editModal.visible}
        onClose={() =>
          setEditModal((prevData) => {
            return {
              ...prevData,
              visible: false,
            };
          })
        }
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Edit Staff {editModal.name}
          </ModalHeader>
          <ModalBody>
            <div className="h-80 overflow-y-scroll">
              <form
                onSubmit={handleSubmit(submit)}
                className="flex flex-col gap-5 my-5"
              >
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
                  readOnly
                  value={editModal.staffid}
                  type="text"
                  placeholder="Staff ID"
                  className="cursor-none"
                />
                <Input
                  errorMessage={errors.password?.message}
                  isInvalid={!!errors.password}
                  {...register("password")}
                  label={"Password"}
                  type="password"
                  placeholder="Password"
                />
                {loading ? (
                  <Button
                    type="button"
                    disabled={true}
                    className="bg-emerald-700/90 text-white w-full h-12 mt-12 text-lg"
                    isLoading
                  >
                    Updating...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-emerald-700 text-white w-full h-12 mt-12 text-lg"
                  >
                    Update
                  </Button>
                )}
              </form>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* Delete Modal */}
      <Modal
        size="sm"
        isOpen={deleteModal.visible}
        onClose={() =>
          setDeleteModal((prevData) => {
            return {
              ...prevData,
              visible: false,
            };
          })
        }
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Delete User {deleteModal.name}
          </ModalHeader>
          <ModalBody>
            <div className="text-[0.7rem] font-semibold">
              <p className="my-3">are you sure,you want to delete this user</p>
              <h1>Name : {deleteModal.name}</h1>
              <h1>Email : {deleteModal.email}</h1>
              <h1>Staff ID : {deleteModal.staffid}</h1>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={() =>
                setDeleteModal((prevData) => {
                  return {
                    ...prevData,
                    visible: false,
                  };
                })
              }
              className="bg-transparent border-2 border-red rounded-md text-red-700"
            >
              Cancel
            </Button>
            <Button
              onPress={() => DeleteThisUser(deleteModal.id)}
              className="bg-red-700 rounded-md text-white "
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Filtered by option */}
      <Drawer
        isOpen={isOpen}
        onClose={() => setisOpen(false)}
        placement={"left"}
        size="md"
      >
        <DrawerContent>
          <DrawerHeader className="flex flex-col gap-1">
            Filtered By
          </DrawerHeader>
          <DrawerBody>
            <RadioGroup
              label="Select method to be filtered by"
              value={filteredBy.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleFilteredSelected(e.target.id, e.target.value);
                setFilteredBy((prevData) => {
                  return {
                    ...prevData,
                    name: e.target.id,
                    value: e.target.value,
                  };
                });
              }}
            >
              <Radio id="Name" value="name">
                Name
              </Radio>
              <Radio id="Staff ID" value="staffid">
                Staff ID
              </Radio>
              <Radio id="Email" value="email">
                Email
              </Radio>
            </RadioGroup>
            <p className="text-default-500 text-small">
              Filtered by: {filteredBy.name}
            </p>
          </DrawerBody>
          <DrawerFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => {
                setisOpen(false);
                setFilteredBy((prevData) => {
                  return {
                    ...prevData,
                    name: "",
                    value: "",
                  };
                });
              }}
            >
              Close
            </Button>
            <Button color="primary" onPress={() => setisOpen(false)}>
              Done
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className="flex w-full flex-row mx-auto items-center p-5">
        <div
          className={`overflow-hidden inline-flex gap-5 items-center transition-all duration-500 ${
            hideSearch ? "w-0 opacity-0" : "w-full opacity-100 mr-5"
          }`}
        >
          <FaFilter
            size={40}
            onClick={() => setisOpen(true)}
            className="text-emerald-700 cursor-pointer p-1 rounded-md border-2 border-emerald-600"
          />

          <Input
            placeholder={`Search by ${filteredBy.name}`}
            className=""
            endContent={<FaSearch />}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleSearch(e.target.value);
            }}
          />
        </div>
        <FaSearch
          size={40}
          onClick={() => setHideSearch(!hideSearch)}
          className="text-emerald-700 cursor-pointer p-1 rounded-md border-2 border-emerald-600"
        />
      </div>
      <Table isStriped aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No user available"} items={rows}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllUsers;
