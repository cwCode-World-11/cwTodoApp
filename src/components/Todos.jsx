import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaPencilAlt,
  FaRegCheckCircle,
  FaTrashAlt,
  FaSmileBeam,
} from "react-icons/fa";
import { HiDocumentAdd } from "react-icons/hi";
import { useHomeDataContext } from "../Hooks/HomeDataContext";
import { useGlobalContext } from "../Hooks/GlobalDataContext";
import {
  useAddTodo,
  useEditTodo,
  useGetTodos,
  useUpdateTodo,
} from "../lib/tanstackQuery/tanstackQuery";
import { v4 as uuidV4 } from "uuid";
import { CircularProgress } from "@mui/material";
import Confetti from "react-confetti";
import { categoryFilterFn } from "../lib/utilities";
import KEYS from "../lib/constants";

// {
//   id:"1",
//   category:["Birthday","Coding"],
//   createdAt:Date.now(),//it include update date(edited)
//   isCompleted:true,
//   priority:"low",//by default
//   title:"Hi this is Title",
//   body:quillData.ops
//   isDocument:false,
// }

const Todos = () => {
  const [tempEditTodo, setTempEditTodo] = useState({});
  const { currentUser, Toast } = useGlobalContext();
  const { filterTxt, categoryName, setIsConfettiVisible, isConfettiVisible } =
    useHomeDataContext();
  const { mutateAsync: addNewTodo, isPending: isAddTodoLoading } = useAddTodo();
  const { mutateAsync: editTodo, isPending: isEditLoading } = useEditTodo();
  const { mutateAsync: updateTodo } = useUpdateTodo();
  const { data, isPending } = useGetTodos(currentUser.uid);
  const [userData, setUserData] = useState(null); //TODO:All(userData,todo,pinned todo,completed todo)
  const [pinnedTodos, setPinnedTodos] = useState([]); //TODO:Pinned Todos
  const [todos, setTodos] = useState([]); //TODO:Todos
  const [completedTodos, setCompletedTodos] = useState([]); //TODO:Completed Todos
  const [searchedTodos, setSearchedTodos] = useState([]); //TODO:searched Todos
  // const [isConfettiVisible, setIsConfettiVisible] = useState(false);
  const navigate=useNavigate();
  const inputTodoRef = useRef("");

  useEffect(() => {
    if (data) {
      if(!data?.todos){
        setTodos([]);
        return
      }
      const pinnedTodosArr = [],
        todosArr = [],
        completedTodosArr = [];
      setUserData(data);

      // Alert: filter + category
      // NOTE: filter um "All" category um "All" iruntha pinned,completed,todo else only todo and completed category based
      if (filterTxt === "All") {
        if (categoryName === "All") {
          const all = categoryFilterFn(categoryName, data.todos);
          // NOTE:Pinnded todos
          pinnedTodosArr.splice(0, pinnedTodosArr.length);
          todosArr.splice(0, todosArr.length);
          completedTodosArr.splice(0, completedTodosArr.length);
          all.forEach((ele) => {
            let flagPinFound = false;
            data.pinnedTodos.find((e) => {
              if (e === ele.id) {
                pinnedTodosArr.push(ele);
                flagPinFound = true;
                return;
              }
            });
            if (flagPinFound === false) {
              if (ele.isCompleted) {
                completedTodosArr.push(ele);
              } else {
                todosArr.push(ele);
              }
            }
            flagPinFound = false;
          });
        } else {
          pinnedTodosArr.splice(0, pinnedTodosArr.length);
          todosArr.splice(0, todosArr.length);
          completedTodosArr.splice(0, completedTodosArr.length);
          const all = categoryFilterFn(categoryName, data.todos);
          todosArr.push(...all);
        }
      } else if (
        filterTxt === KEYS.filterNames[0] ||
        filterTxt === KEYS.filterNames[1]
      ) {
        const complete = [],
          incomplete = [];
        const all = categoryFilterFn(categoryName, data.todos);
        all.filter((ele) => {
          if (ele.isCompleted) {
            complete.push(ele);
          } else {
            incomplete.push(ele);
          }
        });
        if (filterTxt === KEYS.filterNames[0]) {
          console.log("complete:", complete);
          pinnedTodosArr.splice(0, pinnedTodosArr.length);
          todosArr.splice(0, todosArr.length);
          completedTodosArr.splice(0, completedTodosArr.length);
          todosArr.push(...complete);
          setTodos(todosArr);
        } else {
          console.log("incomplete:", incomplete);
          pinnedTodosArr.splice(0, pinnedTodosArr.length);
          todosArr.splice(0, todosArr.length);
          completedTodosArr.splice(0, completedTodosArr.length);
          todosArr.push(...incomplete);
          setTodos(todosArr);
        }
      } else {
        // NOTE: Eliminate "Priority: " word (Low,Medium,High)
        const priorityLevel = filterTxt.substring(11).toLowerCase();
        const all = categoryFilterFn(categoryName, data.todos);
        const f = [];
        all.filter((ele) => {
          if (ele.priority === priorityLevel) {
            f.push(ele);
          }
        });
        pinnedTodosArr.splice(0, pinnedTodosArr.length);
        todosArr.splice(0, todosArr.length);
        completedTodosArr.splice(0, completedTodosArr.length);
        todosArr.push(...f);
      }
      setPinnedTodos(pinnedTodosArr);
      setTodos(todosArr);
      setCompletedTodos(completedTodosArr);
    }
  }, [data, categoryName, filterTxt, data?.pinnedTodos]);

  const handleAdd = async () => {
    try {
      const todoTitle = inputTodoRef.current.value;
      if (!todoTitle) {
        Toast.warning("Please don't leave blank input!");
        return;
      }
      const todoObj = {
        id: uuidV4(),
        category: [],
        createdAt: Date.now(), //it include update date(edited)
        isCompleted: false,
        priority: "low", //by default
        title: todoTitle,
        body: null, //html format
        isDocument: false,
      };
      await addNewTodo({ docId: currentUser.uid, todoObj });
      Toast.success("Todo added successfully");
      inputTodoRef.current.value = "";
    } catch (error) {
      console.log("error:", error);
      Toast.error("Error for adding new todo");
    }
  };

  const handleEdit = async () => {
    const todo = tempEditTodo;
    try {
      const todoObj = {
        id: todo.id,
        category: todo.category,
        createdAt: Date.now(), //it include update date(edited)
        isCompleted: todo.isCompleted,
        priority: todo.priority, //by default
        title: inputTodoRef.current.value,
        body: todo.body, //html format
        isDocument: false,
      };

      // userData.todos=All todo
      const todosExceptEdit = userData.todos.filter(
        (ele) => ele.id !== todo.id
      );
      const editedTodos = [todoObj, ...todosExceptEdit];
      await editTodo({ docId: currentUser.uid, todos: editedTodos });
      Toast.success("Todo edited successfully");
      inputTodoRef.current.value = "";
    } catch (error) {
      console.error("error:", error);
      Toast.error("Cannot update todo");
    } finally {
      setTempEditTodo({});
    }
  };

  const handleDelete = async (todo) => {
    try {
      // userData.todos=All todo
      const todosExceptClicked = userData.todos.filter(
        (ele) => ele.id !== todo.id
      );

      // NOTE: pinned ku id mattum pothum
      if (userData.pinnedTodos.length > 0) {
        const isPinned = userData.pinnedTodos.includes(todo.id);
        if (isPinned) {
          const idExceptDelete = userData.pinnedTodos.filter(
            (id) => id !== todo.id
          );
          await updateTodo({
            docId: currentUser.uid,
            dataObj: { pinnedTodos: idExceptDelete },
          });
          Toast.success("Pinnded id successfully deleted!");
        }
      }

      await editTodo({ docId: currentUser.uid, todos: todosExceptClicked });
      Toast.success("Todo deleted successfully");
    } catch (error) {
      console.error("error:", error);
      Toast.error("Cannot delete todo");
    }
  };

  const handleComplete = async (todo) => {
    try {
      let msg = "";
      const todos = userData.todos.map((ele) => {
        if (ele.id === todo.id) {
          ele.isCompleted ? false : setIsConfettiVisible(true);
          ele.isCompleted
            ? (msg = "Task uncomplete!")
            : (msg = "Task completed successfully!!!");
          return { ...ele, isCompleted: !ele.isCompleted };
        }
        return ele;
      });
      await updateTodo({ docId: currentUser.uid, dataObj: { todos } });
      setTimeout(() => setIsConfettiVisible(false), 20000);
      Toast.success(msg);
    } catch (error) {
      console.error("error:", error);
      Toast.error("Failed to make complete the todo!");
    }
  };

  const handleSearch = () => {
    try {
      const inputVal = inputTodoRef.current.value;
      if (inputVal === "") {
        Toast.warning("Please enter some input for search results");
        return;
      }
      const searchedNote = userData.todos.filter((e) => {
        if (e.title.toLowerCase().includes(inputVal.toLowerCase())) {
          return e;
        }
      });
      if (searchedNote.length > 0) {
        setSearchedTodos(searchedNote);
      } else {
        Toast.log("There is no result for '" + inputVal + "'");
      }
    } catch (error) {
      console.error("error:", error);
      Toast.error("Error: " + error);
    }
  };

  return (
    <section className="h-full">
      {isConfettiVisible && (
        <div className="confetti w-full bg-transparent absolute left-0 top-0">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={150}
            recycle={false}
            gravity={0.4}
            // wind={-0.6} // Confetti comes from the left toward the center
            // initialVelocityX={10} // Confetti blasts inward from the left
            colors={["#ff5b5b", "#ffd700", "#00aaff", "#00cc88"]}
            // origin={{ x: 0, y: 1 }} // Bottom left corner
            confettiSource={{
              x: 1,
              y: 1,
              w: window.innerWidth,
              h: window.innerHeight,
            }}
          />
        </div>
      )}
      <div className="aaa flex flex-col items-center h-full">
        <AddAndSearch
          inputTodoRef={inputTodoRef}
          handleAdd={
            Object.keys(tempEditTodo).length === 0 ? handleAdd : handleEdit
          }
          handleSearch={handleSearch}
          isPending={
            isAddTodoLoading ||
            (Object.keys(tempEditTodo).length !== 0 ? isEditLoading : false)
          }
          searchedTodos={searchedTodos}
          setSearchedTodos={setSearchedTodos}
        />
        {userData?.todos?.length === 0 && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div>
              <FaSmileBeam size={100} />
            </div>
            <p className="m-9 text-xl" id="makeYourNotes">
              Make your notes
            </p>
          </div>
        )}
        {userData?.todos.length > 0 && (
          <div className="overflow-y-auto w-full flex flex-col items-center justify-start gap-2 mt-4">
            <div className="whileDeleting">
              {isEditLoading && Object.keys(tempEditTodo).length === 0 && (
                <CircularProgress size={15} color="#475569" />
              )}
            </div>

            {/*------------ Searched Todos ------------ */}

            {searchedTodos.length > 0 &&
              searchedTodos.map((ele) => {
                return (
                  <Note
                    key={ele.id}
                    todo={ele}
                    inputTodoRef={inputTodoRef}
                    setTempEditTodo={setTempEditTodo}
                    handleDelete={handleDelete}
                    handleComplete={handleComplete}
                  />
                );
              })}

            {/*------------ Pinned Todos ------------ */}
            {searchedTodos.length === 0 && pinnedTodos?.length > 0 && (
              <div className="pinnedTodos w-full flex flex-col items-center justify-center">
                <span className="p-2 justify-start w-[80%] opacity-25">
                  Pinned todos
                </span>
                {pinnedTodos?.map((ele) => {
                  return (
                    <Note
                      key={ele.id}
                      todo={ele}
                      inputTodoRef={inputTodoRef}
                      setTempEditTodo={setTempEditTodo}
                      handleDelete={handleDelete}
                      handleComplete={handleComplete}
                    />
                  );
                })}
                <div className="dividerLine my-8"></div>
              </div>
            )}

            {/* ------------Notes Todos ------------- */}
            {isPending && <h1>Loading todos...</h1>}
            {searchedTodos.length === 0 &&
              !isPending &&
              todos?.map((ele) => {
                return (
                  <Note
                    key={ele.id}
                    todo={ele}
                    inputTodoRef={inputTodoRef}
                    setTempEditTodo={setTempEditTodo}
                    handleDelete={handleDelete}
                    handleComplete={handleComplete}
                  />
                );
              })}

            {/*------------ Completed Todos ------------- */}
            {searchedTodos?.length === 0 && completedTodos?.length > 0 && (
              <div className="completedTodos w-full flex flex-col items-center justify-center">
                <div className="dividerLine my-8"></div>
                <span className="p-2 justify-start w-[80%] opacity-25">
                  Completed todos
                </span>
                {completedTodos.map((ele) => {
                  return (
                    <Note
                      key={ele.id}
                      todo={ele}
                      inputTodoRef={inputTodoRef}
                      setTempEditTodo={setTempEditTodo}
                      handleDelete={handleDelete}
                      handleComplete={handleComplete}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="bg-red-500 w-full h-fit relative">
      <div 
      className="absolute bottom-10 right-10 bg-blue-500 p-3 rounded-full"
      onClick={()=>navigate("/documentView/new")}
      >
        <HiDocumentAdd size={30}/>
      </div></div>
    </section>
  );
};

function Note({
  todo,
  inputTodoRef,
  setTempEditTodo,
  handleDelete,
  isDeleteLoading,
  handleComplete,
}) {
  const { todoSelectedIds, setTodoSelectedIds } = useHomeDataContext();
  const moreDetails = todo?.categories?.length > 0 ? true : false;
  const categories = todo?.categories || [];
  const { title, body, id } = todo || {};
  const navigate = useNavigate();
  const bgStyles = "centerAll rounded-lg p-3 w-[80%] h-fit bg-slate-600 mb-1";

  return (
    <div
      className={
        todo.isCompleted ? "line-through opacity-50 " + bgStyles : bgStyles
      }
    >
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-4 cursor-default">
          <div>
            <input
              type="checkbox"
              className="noteCheckbox"
              onClick={(e) => {
                if (e.target.checked) {
                  const IDs = [...todoSelectedIds];
                  IDs.push(id);
                  setTodoSelectedIds(IDs);
                } else {
                  const IDs = todoSelectedIds.filter((ele) => id !== ele);
                  setTodoSelectedIds(IDs);
                }
              }}
            />
          </div>
          <p>{title || body.split(" ").slice(0, 1).toString()}</p>
        </div>
        {todoSelectedIds.length === 0 && (
          <div className="h-full w-[20%] flex justify-between items-center">
            <div
              className="cursor-pointer"
              onClick={() => {
                if (!todo.isDocument) {
                  inputTodoRef.current.value = todo.title;
                  setTempEditTodo(todo);
                } else {
                  navigate("/documentView/" + id);
                }
              }}
            >
              <FaPencilAlt />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => handleComplete(todo)}
            >
              <FaRegCheckCircle />
            </div>
            {!isDeleteLoading && (
              <div
                className="cursor-pointer"
                onClick={() => handleDelete(todo)}
              >
                <FaTrashAlt />
              </div>
            )}
          </div>
        )}
      </div>
      {moreDetails && (
        <div className="w-full">
          <div className="dividerLine mt-4 opacity-50"></div>
          <div className="categoriesAndDetails flex justify-between cursor-default">
            <div className="categories mt-1">
              {categories.map((e, idx) => {
                return (
                  <span
                    key={idx}
                    className="p-1 bg-slate-700 mx-1 rounded text-xs"
                  >
                    {e}
                  </span>
                );
              })}
            </div>
            <div className="date mt-1 text-center">
              <span className="text-xs opacity-70">2 days ago</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddAndSearch({
  inputTodoRef,
  handleAdd,
  handleSearch,
  isPending,
  searchedTodos,
  setSearchedTodos,
}) {
  const { Toast } = useGlobalContext();

  const iconStyle = "w-fit p-3 rounded-full cursor-pointer hover:opacity-70";

  return (
    <div className="flex w-[40vw] justify-evenly items-center mt-[10%]">
      <div className="w-fit flex items-center">
        <input
          type="text"
          className="bg-white rounded-full p-2 text-gray-900"
          placeholder="Add or search todos"
          ref={inputTodoRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (inputTodoRef.current.value !== "") handleAdd();
              else Toast.warning("Please add some text");
            }
          }}
        />
        {searchedTodos.length > 0 && (
          <span
            className="bg-red-800 w-[2vw] h-[2vw] rounded-full flex items-center justify-center m-1 p-1 cursor-pointer"
            onClick={() => {
              setSearchedTodos([]);
              inputTodoRef.current.value = "";
            }}
          >
            X
          </span>
        )}
      </div>
      <div className="flex justify-evenly items-center gap-4">
        <div className={"bg-white " + iconStyle} onClick={handleSearch}>
          {<FaSearch color="gray" />}
        </div>
        {(isPending && <CircularProgress />) || (
          <div className={"bg-blue-500 " + iconStyle} onClick={handleAdd}>
            <FaPlus />
          </div>
        )}
      </div>
    </div>
  );
}

export default Todos;
