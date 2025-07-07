import { useState, useEffect } from "react";
import UserEdit from "../components/UserEdit";
import { Avatar } from "@mui/material";
import { logOut } from "../lib/firebase/auth";
import { useGetTodos, useUpdateTodo } from "../lib/tanstackQuery/tanstackQuery";
import { useGlobalContext } from "../Hooks/GlobalDataContext";
import { Puff } from "react-loader-spinner";
import useUploadFile from "../lib/firebase/firebaseStorage";
import {useNavigate} from "react-router-dom"

const Profile = () => {
  const [user, setUser] = useState(null);
  const { currentUser, Toast } = useGlobalContext();
  const { mutateAsync: updatePinnedIDs } = useUpdateTodo();
  const { data, isPending } = useGetTodos(currentUser.uid);
  const { handleUpload } = useUploadFile();
  const navigate=useNavigate()

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  async function handleLogOut() {
    try {
      await logOut();
      navigate("/login");
      Toast.log("Logged out");
    } catch (error) {
      console.error("error:", error);
      Toast.error("Failed to logout!");
    }
  }

  async function handleName(name, setIsEditOpen) {
    try {
      Toast.log("Changing name...");

      await updatePinnedIDs({ docId: currentUser.uid, dataObj: { name } });

      setIsEditOpen(false);
      Toast.success("Name changed successfully");
    } catch (error) {
      console.error("error:", error);
      Toast.error("Error while changing name");
      setIsEditOpen(false);
    }
  }

  async function handleFileSet(e) {
    try {
      const f = e.target.files[0];
      if (f) {
        if (!f) {
          Toast.error("File not selected!!!");
        }
        if (f.type.split("/")[0] !== "image") {
          Toast.error("File type is not valid");
        }
        Toast.log("Uploading profile picture...");
        await handleUpload(currentUser, f);
      }
    } catch (error) {
      console.error("error:", error);
      Toast.error("Error while uploading in database");
    }
  }

  if (isPending) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Puff
          visible={true}
          height="100"
          width="100"
          color="#60a5fa"
          ariaLabel="puff-loading"
        />
      </div>
    );
  }

  return (
    <section className="flex items-center justify-center flex-col w-[80vw] h-full bg-[#121212]">
      <div className="">
        <div className="flex items-center justify-center w-full">
          {/* Profile picture */}
          <div className="flex items-center justify-center w-full p-3">
            <Avatar
              src={user?.avatarURL}
              sx={{ width: 100, height: 100 }}
              className="m-5 cursor-pointer"
              onClick={()=>{
                if(!user?.avatarURL){
                  Toast.warning("There is no profile picture!!!")
                  return;
                }
                window.open(user?.avatarURL,"_blank")
              }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSet}
              className="relative -bottom-10 -left-5 w-fit text-sm text-gray-300 hover:text-gray-500 border border-gray-300 rounded-md p-1 transition-all hover:border-gray-500"
            />
          </div>
        </div>
        <div className="text-center">
          <span>{currentUser?.email}</span>
        </div>
        <UserEdit
          label="Name"
          labelName="Name"
          placeholder="Enter your name"
          value={
            user?.username ? user?.username : currentUser.email.toString().split("@")[0]
          }
          handleFn={handleName}
        />
        <div
          className="flex justify-center items-center cursor-pointer"
          onClick={handleLogOut}
        >
          <button className="text-white bg-red-500 rounded-md p-2 hover:bg-transparent hover:border border-gray-300 transition-all ">
            Log out
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
