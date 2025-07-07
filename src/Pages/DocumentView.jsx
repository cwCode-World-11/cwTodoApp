import {useState,useEffect} from "react";
import Document from "../Doc/Document";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../Hooks/GlobalDataContext";
import { useAddTodo,useGetUser,useUpdateTodo } from "../lib/tanstackQuery/tanstackQuery";
import { quillContentToText } from "../lib/utilities";
import KEYS from "../lib/constants.js"
import { v4 as uuidV4 } from "uuid";

const DocumentView = () => {
  // TODO: dropdown and priorities list.
  const { mutateAsync: addNewTodo, isPending: isAddTodoLoading } = useAddTodo();
  const { currentUser, Toast } = useGlobalContext();
  const { data: getUser, isPending, isError } = useGetUser(currentUser?.uid);
  const { mutateAsync: updateField } = useUpdateTodo();
  const [data,setData]=useState()
  const params = useParams();
  const navigate = useNavigate();


  const fns = {
    handleSave,
  };


  useEffect(() => {
    if (getUser) {
      setData(getUser);
    }
  }, [getUser]);



  async function handleSave(quillData,priority,category){
    try {
      if (!params.id) {
        Toast.warning("Wrong site url or!!!");
        navigate("/");
        return;
      }

      if (quillData.getLength() <= 1) {
        // because it always begins with "\n" so return=1
        Toast.warning("Please enter something or simply exit!!!");
        return;
      }

      if (params.id === KEYS.newDocParam) {
        // TODO: after save url need replace or navigate to home.
        // Creating new document also modify pinned and categories
        try {
          const title = quillContentToText(quillData.getContents().ops);
          const todoObj = {
            id: uuidV4(),
            category,
            createdAt: Date.now(), //it include update date(edited)
            isCompleted: false,
            priority,
            title,
            body: quillData.getContents().ops, //quill editor library
            isDocument: true,
          };

          await addNewTodo({ docId: currentUser.uid, todoObj });
          navigate("/")
          Toast.success("Todo added successfully");
          //////////////////////////////update content//////////////////
        } catch (error) {
          console.error("Error\n :", error);
          Toast.error("Error for adding new todo");
          return;
        }
      } else {
        // modify exsiting document also modify pinned and categories
        const updatedTodo=data.todos.map(e=>{
          if(e.id===params.id){
            const title = quillContentToText(quillData.getContents().ops);
            return {
              ...e,
              title,
              body:quillData.getContents().ops,
              priority,
              category
            }
          }
          return e;
        });
        await updateField({
          docId:currentUser.uid,
          dataObj:{todos:updatedTodo}
        })
        Toast.success("Document updated successfully")
      }
    } catch (error) {
      console.log("error:", error);
      Toast.error(error);
    }
  }

  return (
    <section>
      <div className="w-fit">
        <Document fns={fns} />
      </div>
    </section>
  );
};

export default DocumentView;
