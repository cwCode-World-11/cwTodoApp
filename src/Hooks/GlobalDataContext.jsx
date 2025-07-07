import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "../components/Toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Puff } from "react-loader-spinner";

const GlobalContext = createContext();

export function useGlobalContext() {
  return useContext(GlobalContext);
}

const GlobalDataContext = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const Toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // This is event listener
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User sign in
        setCurrentUser(user);
        setIsLoading(false);
      } else {
        // User sign out
        setCurrentUser(null);
        setIsLoading(false);
        navigate("/login");
      }
    });

    return () => unsub();
  }, [auth]);

  const data = { Toast, currentUser };
  return (
    <GlobalContext.Provider value={data}>
      {isLoading ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <Puff
            visible={true}
            height="100"
            width="100"
            color="#60a5fa"
            ariaLabel="puff-loading"
          />
        </div>
      ) : (
        children
      )}
    </GlobalContext.Provider>
  );
};

export default GlobalDataContext;
