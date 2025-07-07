import { createContext, useState, useContext } from "react";
import { useToast } from "../components/Toast";

const HomeDataCreateContext = createContext();

function useHomeDataContext() {
  return useContext(HomeDataCreateContext);
}

const HomeDataContext = ({ children }) => {
  const [filterTxt, setFilterTxt] = useState("All");
  const [categoryName, setCategoryName] = useState("All"); //Display all category.
  const [todoSelectedIds, setTodoSelectedIds] = useState([]);
  const [isConfettiVisible, setIsConfettiVisible] = useState(false);
  const Toast = useToast();

  const data = {
    Toast,
    filterTxt,
    setFilterTxt,
    categoryName,
    setCategoryName,
    todoSelectedIds,
    setTodoSelectedIds,
    isConfettiVisible,
    setIsConfettiVisible,
  };
  return (
    <HomeDataCreateContext.Provider value={data}>
      {children}
    </HomeDataCreateContext.Provider>
  );
};

export { useHomeDataContext };
export default HomeDataContext;
