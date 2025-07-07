import { useState, useEffect, useCallback } from "react";
import Quill from "quill";
import { FaUndo, FaRedo, FaPrint } from "react-icons/fa";
import { useNavigate,useParams } from "react-router-dom";
import { useGetUser } from "../lib/tanstackQuery/tanstackQuery";
import "quill/dist/quill.snow.css";
import { useGlobalContext } from "../Hooks/GlobalDataContext";
import BasicPopover from "./../components/Modal/BasicPopover"
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Checkbox from '@mui/material/Checkbox';
import KEYS from "../lib/constants"
import "./docStyle.css";



const Document = ({ fns }) => {
  const [quill, setQuill] = useState();
  const { currentUser, Toast } = useGlobalContext();
  const { data: getUser, isPending } = useGetUser(currentUser?.uid);
  const [user, setUser] = useState();
  const [priority,setPriority]=useState("low");
  const [category,setCategory]=useState(null);
  const [isSaveLoading,setIsSaveLoading]=useState(false);
  const navigate = useNavigate();
  const params=useParams()

  const ToolbarOptions = [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    ["clean"],
  ];

  useEffect(() => {
    if(!isPending && getUser) {
    setUser(getUser);
    let t;

    if(params.id!==KEYS.newDocParam){
      if(getUser.todos.length>0){
        t=getUser?.todos.find(e=>e.id===params.id);
        if(getUser.categories.length>0){
          const c = getUser?.categories.filter(ele=>{
          return t?.category.map(tc=>{
            if(ele.includes(tc)) return ele 
          })
        })
        .map(e=>{
          if(t?.category.includes(e)){
            return {[e]:true}
          }
          return {[e]:false}
        });

        /*
          what c var do?
          well, first filtering category list from todo.
          home page la category name onnu delete pannita intha document popover la kaataathu.but,still database la todo category la irukum (eg: stark name category list and todo category list la irukku. stark name ah home page la delete panniten. document popover la kaataathu but, database la todo category list la name irukkum). so, atha filter panni ethu ethu lam category list la irukko athu mattum thaan eduthukuren {name1:true,name2:false} format la marthuren. ippo save button ah click panna rendu list-um replace aagum which means category list la enna enna name iruko antha name thaan todo category-layum(if selected) irukkum.
        */
        
        const a=Object.assign({},...c)
        setCategory(a)
          }
        }
      }
      
      setPriority(t?.priority||"low")
    }
  }, [getUser,isPending,getUser?.priority]);

  useEffect(() => {
    if (!quill) return;
    const handler = (delta, olDelta, source) => {
      if (source !== "user" && source !== "api") {
        alert("You are not user!");
        navigate("/");
        return;
      }

      // console.log("delta:", quill.getContents().ops);
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [quill]);

  useEffect(()=>{
    // setting doc(already exist)
    if(user){
      // quill update
      if(quill!==null&&params.id!==KEYS.newDocParam){
        const todo=user.todos.find(e=>params.id===e.id)
      if(todo.body!==null){
        quill.setContents(todo?.body)
      }
      }
    }
  },[user, quill, params.id])

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const s = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: ToolbarOptions },
    });
    setQuill(s);
  }, []);


  function handlePriority(e){
    const v=e.target.value
    setPriority(v)
  }

  function handleCategory(e){
    setCategory((prev)=>{
      return {
        ...prev,
      [e.target.name]:e.target.checked
      }
    })
  }

  if(isPending){
    return <h1 className="h-screen w-screen flex items-center justify-center text-center text-gray-500 text-3xl font-bold">Loading...</h1>
  }

  return (
    <main style={{width:"99vw"}}>
      <div 
      className="customizeTool flex items-center justify-between w-full"
      style={{backgroundColor:"#f3f3f3",padding:".5em"}}>
        <div 
        className="group text-blue-500 font-bold items-center text-3xl">
          Document Type
        </div>
        <div className="text-gray-500 flex gap-3 h-full items-center">
          <div 
          className="gap-3"
          style={{color:"gray",display:"flex",flexDirection:"row"}}
          >
           
            <div
              className="icon cursor-pointer"
              onClick={() => quill.history.undo()}
            >
              <FaUndo />
            </div>
            <div
              className="icon cursor-pointer"
              onClick={() => quill.history.redo()}
            >
              <FaRedo />
            </div>
          </div>

          <div className="group" style={{color:"gray",display:"flex",flexDirection:"row",}}>
            <div className="icon cursor-pointer" onClick={() => window.print()}>
              <FaPrint />
            </div>
          </div>
           
            <div
              className="flex items-center justify-center gap-3 cursor-pointer"
            >
            {/*//////Priority/////////////////*/}
              <BasicPopover
                label="Priority"
              >
                  <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  // defaultValue="low"
                  value={priority}
                  onChange={handlePriority}
                  style={{
                    padding:"1em"
                  }}
                >
                  <FormControlLabel value="low" control={<Radio />} label="Low" />
                  <FormControlLabel value="medium" control={<Radio />} label="Medium" />
                  <FormControlLabel value="high" control={<Radio />} label="High" />
                </RadioGroup>
              </BasicPopover>
            {/*//////Category/////////////////*/}
              {category&&<BasicPopover
                label="Category"
              >
                  <div 
                    style={{
                      padding:"1em",
                      overflowY:"auto",
                      display:"flex",
                      flexDirection:"column"
                    }}
                  >
                  {/*Object.entries(categoryObj)=returns key and value pair(array). now destructure it//////  */}
                    {Object.entries(category).map(([key,value])=>{
                      return(
                        <FormControlLabel
                        key={key}
                          control={
                            <Checkbox
                              checked={value}
                              onChange={handleCategory}
                              name={key}
                            />
                          }
                          label={key}
                        />
                      )
                    })}
                  </div>
              </BasicPopover>}
          </div>
          <div
            className="rounded-md cursor-pointer items-center justify-center"
            style={{color:"white",display:"flex",flexDirection:"row",backgroundColor:"gray",width:"5em",height:"30px",padding:"19px",marginLeft:"2px"}}
            onClick={async() => {
              setIsSaveLoading(true)
              let c=[];
                if (category!==null&&Object.keys(category).length > 0) {
                    c = Object.entries(category)
                      .filter(([key, value]) => value === true)
                      .map(([key]) => key.toString());
                  }
                await fns.handleSave(quill,priority,c); //NOTE: await is for setIsSaveLoading(true)
                setIsSaveLoading(false)
              }}
          >
            {isSaveLoading?<CircularProgress color="white" size={16}/>:<Button color="white">Save</Button>}

          </div>
          <div
            className="rounded-md font-bold cursor-pointer items-center justify-center"
            style={{color:"white",display:"flex",flexDirection:"row",backgroundColor:"red",marginRight:".5em",width:"30px",height:"30px",padding:"10px"}}
            onClick={() => {
            navigate("/")
            return;
            }
          }
          >
            <div className="icon cursor-pointer">X</div>
          </div>
        </div>
      </div>

      {/*/////////////////NOTE: QUILL LIBRARY///////////////////*/}
      <div className="editContainer bg-[#f3f3f3]" ref={wrapperRef}></div>
    </main>
  );
};

export default Document;
