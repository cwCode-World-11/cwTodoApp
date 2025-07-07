import { useState, useEffect } from "react";
import { useGlobalContext } from "../Hooks/GlobalDataContext";
import { useHomeDataContext } from "../Hooks/HomeDataContext";
import {
  FaCopy,
  FaThumbtack,
  FaTrashAlt,
  FaRegCheckCircle,
} from "react-icons/fa";
import {
  useGetTodos,
  useEditTodo,
  useUpdateTodo,
} from "../lib/tanstackQuery/tanstackQuery";
import { deSelectAllNotes } from "../lib/utilities";
import { v4 as uuidV4 } from "uuid";

/* single and multiselect
Single Select Options
//TODO: Copy , Pinnded
Multiple Select Options
//TODO: Complete , Delete, Copy , Pinnded  
*/

// TODO: copy(duplicate) nadakapothu id,date change panna marakkakudaathu.
const Menu = () => {
  const { todoSelectedIds, setTodoSelectedIds, setIsConfettiVisible } =
    useHomeDataContext();
  const { currentUser, Toast } = useGlobalContext();
  const [userData, setUserData] = useState(null);
  const { data, isPending } = useGetTodos(currentUser.uid);
  // const [selectedTodos, setSelectedTodos] = useState([]);
  const { mutateAsync: duplicateTodos } = useEditTodo();
  const { mutateAsync: updatePinnedIDs } = useUpdateTodo();

  useEffect(() => {
    if (data) {
      setUserData(data);
    }
  }, [data]);

  // useEffect(() => {
  //   if (todoSelectedIds.length > 0) {
  //     const selectedObj = todoSelectedIds.map((ele) => {
  //       return userData.todos.find((e) => {
  //         if (e.id === ele) return e;
  //       });
  //     });
  //     setSelectedTodos(selectedObj);
  //   }
  // }, [todoSelectedIds]);

  return (
    <section className="absolute top-0 left-[30vw]">
      {todoSelectedIds.length !== 0 && (
        <div className="menu w-[40vw] bg-[#3f3f3f] flex flex-row justify-evenly items-center rounded p-4">
          {todoSelectedIds.length === 1 ? (
            <SingleSelectMenu />
          ) : (
            <MultiSelectMenu />
          )}
        </div>
      )}
    </section>
  );

  function SingleSelectMenu() {
    return (
      <>
        <div className="cursor-pointer" onClick={handleCopy}>
          <FaCopy />
        </div>
        <div className="cursor-pointer" onClick={handlePin}>
          <FaThumbtack />
        </div>
      </>
    );
  }

  function MultiSelectMenu() {
    return (
      <>
        <SingleSelectMenu />
        <div className="cursor-pointer" onClick={handleComplete}>
          <FaRegCheckCircle />
        </div>
        <div className="cursor-pointer" onClick={handleDelete}>
          <FaTrashAlt />
        </div>
      </>
    );
  }
  async function handleCopy() {
    try {
      Toast.log("Copying...");
      const selectedObj = todoSelectedIds.map((ele) => {
        const foundObj = userData.todos.find((e) => e.id === ele);
        if (foundObj) {
          return { ...foundObj, id: uuidV4() };
        }
      });

      const mergeTodos = [...userData.todos, ...selectedObj];

      await duplicateTodos({ docId: currentUser.uid, todos: mergeTodos });
      setTodoSelectedIds([]);
      Toast.success("Copied!!!");
      deSelectAllNotes();
    } catch (error) {
      console.error("error:", error);
      Toast.error("Error while copying!");
    }
  }

  async function handlePin() {
    // NOTE: if all are pinned then unpin all
    // NOTE: if all are unpinned then pin all
    // NOTE: if pinned and unpinned are mixed then pin all except already pinned
    const toPinIds = [];
    const isMixed = {
      pin: false,
      unpin: false,
    };
    let updatedIDs = [];
    if (userData.pinnedTodos.length > 0) {
      todoSelectedIds.forEach((ele) => {
        if (userData.pinnedTodos.includes(ele)) {
          isMixed.pin = true;
        } else {
          isMixed.unpin = true;
        }
      });
    }

    if (isMixed.pin && isMixed.unpin) {
      // TODO: pin all except already pinned
      const noPinnedIDs = todoSelectedIds.filter((ele) => {
        if (!userData.pinnedTodos.includes(ele)) {
          return ele;
        }
      });

      updatedIDs = [...noPinnedIDs, ...userData.pinnedTodos];
    } else if (isMixed.pin) {
      // TODO: unpin all
      updatedIDs = userData.pinnedTodos.filter(
        (ele) => !todoSelectedIds.includes(ele)
      );
    } else {
      // TODO: pin all
      todoSelectedIds.map((ele) => {
        const foundObj = userData.todos.find((e) => e.id === ele);
        if (foundObj) {
          toPinIds.push(foundObj.id);
        }
      });
      updatedIDs = [...userData.pinnedTodos, ...toPinIds]; //NOTE:update pinnedTodos in database
    }

    try {
      Toast.log("Pinning/Unpinning selected items...");
      await updatePinnedIDs({
        docId: currentUser.uid,
        dataObj: { pinnedTodos: updatedIDs },
      });
      Toast.success("Pinning/Unpinning completed!!!");
    } catch (error) {
      console.error("error:", error);
      Toast.error("Error while pinning!");
    }
    setTodoSelectedIds([]);
    deSelectAllNotes();
  }

  async function handleComplete() {
    // TODO: complete selected items

    try {
      Toast.log("Updating completed/incompleted status...");
      const updatedTodos = userData.todos.map((ele) => {
        if (todoSelectedIds.includes(ele.id)) {
          return { ...ele, isCompleted: !ele.isCompleted };
        }
        return ele;
      });

      // NOTE: {dataObj:{field:value}}. so, no matter what updatePinnedIDs is used for, it will update the todos field too.
      await updatePinnedIDs({
        docId: currentUser.uid,
        dataObj: { todos: updatedTodos },
      });
      setIsConfettiVisible(true);
      Toast.success("Completed/incompleted status updated!!!");
    } catch (error) {
      console.error("error:", error);
      Toast.error("Error while completing!");
    }

    setTodoSelectedIds([]);
    deSelectAllNotes();
  }

  async function handleDelete() {
    try {
      Toast.log("Deleting selected items...");
      const updatedTodos = userData.todos.filter((ele) => {
        if (!todoSelectedIds.includes(ele.id)) {
          return ele;
        }
      });
      // NOTE: deleting in pinned todos
      if (userData.pinnedTodos.length > 0) {
        const updatedPinnedTodos = userData.pinnedTodos.filter((ele) => {
          if (!todoSelectedIds.includes(ele)) {
            return ele;
          }
        });
        await updatePinnedIDs({
          docId: currentUser.uid,
          dataObj: { pinnedTodos: updatedPinnedTodos },
        });
      }
      await updatePinnedIDs({
        docId: currentUser.uid,
        dataObj: { todos: updatedTodos },
      });
      Toast.success("Deleted!!!");
    } catch (error) {
      console.error("error:", error);
      Toast.error("Error while deleting!");
    }

    setTodoSelectedIds([]);
    deSelectAllNotes();
  }
};

export default Menu;
