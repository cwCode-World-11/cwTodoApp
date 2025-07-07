import { useState } from "react";
import UserEditModal from "./Modal/UserEditModal";
import { FaPencilAlt } from "react-icons/fa";

const UserEdit = ({ label, placeholder, value, handleFn, labelName }) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="mb-5">
      {isEditing && (
        <UserEditModal
          isEditOpen={isEditing}
          setIsEditOpen={setIsEditing}
          handleFn={handleFn}
          labelName={labelName}
        />
      )}
      <div className="flex gap-2 flex-col items-start w-full">
        <label className="text-sm font-medium">{label}</label>
        <div className="flex items-center gap-2 border-[1px] border-gray-300 rounded-md p-1 w-full">
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            className="w-full bg-transparent border-none outline-none"
            readOnly
          />
          <div
            className="cursor-pointer text-gray-500 hover:text-gray-700 w-10 h-10 flex items-center justify-center rounded-md"
            onClick={() => {
              setIsEditing(true);
            }}
          >
            <FaPencilAlt />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEdit;
