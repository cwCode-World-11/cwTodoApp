import { useEffect } from "react";
import { useGlobalContext } from "../Hooks/GlobalDataContext";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  return currentUser ? children : null;
};

export default PrivateRoute;
