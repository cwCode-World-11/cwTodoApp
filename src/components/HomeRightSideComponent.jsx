import { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import { FaPlus, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { useHomeDataContext } from "../Hooks/HomeDataContext";
import { useGlobalContext } from "../Hooks/GlobalDataContext";
import { useAddCategory, useGetUser } from "../lib/tanstackQuery/tanstackQuery";
import { Puff } from "react-loader-spinner";
import { Link } from "react-router-dom";
import AddCategoryModal from "../components/Modal/AddCategory";
import EditCategoryModal from "./Modal/EditCategory";
import ConfirmationModal from "./Modal/ConfimationModal";
import KEYS from "../lib/constants";

const HomeRightSideComponent = () => {
  // TODO: No need to add filter list in database because it default fo
  const filterList = KEYS.filterNames;

  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]); //TODO:["Birthday","Coding","AI Tools"]

  const { currentUser, Toast } = useGlobalContext();
  const { filterTxt, setFilterTxt, categoryName, setCategoryName } =
    useHomeDataContext();

  const { data: getUser, isPending, isError } = useGetUser(currentUser?.uid);
  const { mutateAsync: addCategory } = useAddCategory();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (getUser) {
      setUser(getUser);
      setCategories(getUser?.categories || []);
    }
  }, [getUser]);

  const handleAddNewCategory = async (
    categoryNameFromModal,
    setCategoryNameFromModal
  ) => {
    const newCategory = categoryNameFromModal;
    try {
      if (newCategory === "") {
        Toast.warning("Please fill some text or click cancel button");
        return;
      }
      if (newCategory === "All" || categories.includes(newCategory)) {
        Toast.warning("This category is already exist");
        return;
      }
      const updatedCategoryList = [...categories, newCategory];
      await addCategory({
        docId: currentUser?.uid,
        categoryList: updatedCategoryList,
      });
      setCategories(updatedCategoryList);
      Toast.log(
        "You added a new category in list. Now you can add your todos into a separate category"
      );
      setCategoryName("All");
      setIsOpen(false);
      setCategoryNameFromModal("");
    } catch (error) {
      console.error("error:", error);
      Toast.error("Failed to add category in list");
    }
  };

  if (isError) {
    console.error("isError:", isError);
    Toast.error("Error while fetching user details");
  }

  return (
    <>
      {isPending && (
        <div className="w-[20vw] h-full flex justify-center items-center">
          <Puff
            visible={true}
            height="50"
            width="50"
            color="#60a5fa"
            ariaLabel="puff-loading"
          />
        </div>
      )}
      {!isPending && (
        <section>
          <div className="h-full w-full">
            <AddCategoryModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              handleAddNewCategory={handleAddNewCategory}
            />
          </div>
          <div className="w-[20vw] h-screen bg-[rgb(34, 34, 34)] fixed top-[0] right-[0] overflow-auto ">
            <div className="h-screen">
              <Link to="/profile">
                <div className="userProfile w-full h-[10vh] flex justify-center items-center gap-2">
                  <Avatar src={user?.avatarURL} />
                  <div>
                    <p style={{ wordBreak: "break-all", cursor: "default" }}>
                      {user?.name}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="filterAndCategories h-[80vh] w-full flex flex-col">
                <div className="overflow-y-auto">
                  <FilterAndCategoriesComponent
                    title="Filter"
                    listArr={filterList}
                    type={filterTxt}
                    setType={setFilterTxt}
                  />
                </div>
                <div className="overflow-y-auto">
                  <FilterAndCategoriesComponent
                    title="Category"
                    listArr={categories}
                    setCategories={setCategories}
                    type={categoryName}
                    setType={setCategoryName}
                  />
                </div>
              </div>
              <div className="addNewCategory h-[10vh]">
                <div
                  className="flex flex-col h-full justify-center items-center cursor-pointer p-[1em]"
                  onClick={() => setIsOpen(true)}
                >
                  <FaPlus />
                  <p>Add New Category</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

function FilterAndCategoriesComponent({
  title,
  listArr,
  setCategories,
  setType,
  type,
}) {
  const [editName, setEditName] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteCategoryName, setDeleteCategoryName] = useState("");
  const { setCategoryName } = useHomeDataContext();
  const { Toast, currentUser } = useGlobalContext();
  const { mutateAsync: addCategory } = useAddCategory();

  const defaultElement = title === "Category" ? ["All", "Uncategory"] : ["All"];

  const handleEditCategory = async (
    categoryNameFromModal,
    setCategoryNameFromModal
  ) => {
    const editCategoryName = categoryNameFromModal;
    try {
      if (editCategoryName === "") {
        Toast.warning("Please fill some text or click cancel button");
        return;
      }
      if (editCategoryName === "All" || listArr.includes(editCategoryName)) {
        Toast.warning(
          "This category is already exist. Try new name or add more text"
        );
        return;
      }
      const editedCategoryList = listArr.map((ele) => {
        if (ele === editName) {
          return categoryNameFromModal;
        }
        return ele;
      });

      await addCategory({
        docId: currentUser?.uid,
        categoryList: editedCategoryList,
      });
      setCategories(editedCategoryList);
      Toast.log(
        "You successfully renamed '" +
          editName +
          "' to '" +
          editCategoryName +
          "' in category list."
      );
      setCategoryName("All");
      setIsEditOpen(false);
      setCategoryNameFromModal("");
    } catch (error) {
      console.error("error:", error);
      Toast.error("Failed to edit name in list");
    }
  };

  const handleConfirm = async () => {
    try {
      const afterDeletedCategoryList = listArr.filter((ele) => {
        if (ele !== deleteCategoryName) {
          return ele;
        }
      });

      await addCategory({
        docId: currentUser?.uid,
        categoryList: afterDeletedCategoryList,
      });
      setCategories(afterDeletedCategoryList);
      Toast.log(
        "'" +
          deleteCategoryName +
          "' was deleted successfully in category list."
      );
      setCategoryName("All");
      setIsConfirmOpen(false);
    } catch (error) {
      console.error("error:", error);
      Toast.error("Failed to delete in list");
    }
  };

  return (
    <div className="my-10 break-words">
      {/* //NOTE : Modal screen */}
      <div className="h-full w-full">
        <EditCategoryModal
          isEditOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
          handleEditCategory={handleEditCategory}
          editName={editName}
        />
        <ConfirmationModal
          isConfirmOpen={isConfirmOpen}
          setIsConfirmOpen={setIsConfirmOpen}
          handleConfirm={handleConfirm}
          title={
            "Do you want to delete '" +
            deleteCategoryName +
            "' in category list"
          }
        />
      </div>
      <h4 className="text-xl">{title}</h4>
      {[...defaultElement, ...listArr].map((e, idx) => {
        const selectedType = type === e ? "bg-blue-500" : "";
        return (
          <div
            key={idx}
            className={
              "w-full cursor-default flex justify-between items-center " +
              selectedType
            }
            onClick={() => {
              setType(e);
            }}
          >
            <p className="p-1">
              {(e.includes("Periority:") && (
                <>
                  Periority:<b>{e.substring(10)}</b>
                </>
              )) ||
                e}
            </p>
            {title === "Category" && e !== "All" && e !== "Uncategory" && (
              <div className="flex justify-evenly items-center w-[25%] h-full">
                <FaPencilAlt
                  className="cursor-pointer"
                  size="10"
                  onClick={() => {
                    if (e === "All") {
                      Toast.warning(
                        "Please Confirm category name except this one."
                      );
                      return;
                    } else {
                      setEditName(e);
                      setIsEditOpen(true);
                    }
                  }}
                />
                <FaTrashAlt
                  className="cursor-pointer"
                  size="10"
                  onClick={() => {
                    setIsConfirmOpen(true);
                    setDeleteCategoryName(e);
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default HomeRightSideComponent;
