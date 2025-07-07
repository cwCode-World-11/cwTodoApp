import React from "react"
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import {
  Login,
  Signup,
  Home,
  Profile,
  DocumentView,
  ForgetPassword,
} from "./Pages/index";
import ToastManager from "./components/Toast";
import PrivateRoute from "./lib/PrivateRouter";
import "./index.css";

// NOTE:Loading type
// NOTE:https://mhnpd.github.io/react-loader-spinner/docs/category/components
// Audio,BallTriangle,Bars,Circles,CirclesWithBar,Grid,Hearts,InfinitySpin,LineWave,MutatingDots,Oval,Puff,RevolvingDot,Rings,RotatingSquare,RotatingLines,TailSpin,ThreeCircles,ThreeDots,Triangle,Watch,FallingLines,Vortex,RotatingTriangles,Radio,ProgressBar,MagnifyingGlass,FidgetSpinner,DNA,Discuss,ColorRing,Comment,Blocks,Hourglass,
function App() {
  //TODO: firebase query
  //TODO: Make sure todo text must be html type.because we need to add image,videos,audio feature
  /*  type userDocument = {
    setting: { theme: "dark", ... },
    username: "Hello World",
    email: "HelloWorld@gmail.com",
    categories:["Birthday","AI Tools","Coding"],
    pinnedTodos:["1","4","5"]//id based
    todos:[
      {
        id:"1",
        category:["Birthday","Coding"],
        createdAt:Date.now(),//it include update date(edited)
        isCompleted:true,
        priority:"low",//by default
        title:"Hi this is Title",
        body:"Hello World <img src={}/> this image was created by ai" //html format
        isDocument:false
      }
    ]
  };
  */

  return (
    <>
      <ToastManager />
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />

        {/* Main Pages AND Private Routes*/}
        <Route element={<Sidebar />}>
          <Route
            path="/"
            exact
            element={
              <PrivateRoute>
                 <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Full editable text like microsoft document */}
        <Route path="documentView/:id" element={<DocumentView />} />

        {/* No Routes Found (404 Error) */}
        <Route
          path="*"
          element={
            <section className="flex flex-col items-center justify-center h-screen">
              <h1 className="text-gray-500 text-6xl font-bold m-4">
                404 PAGE NOT FOUND
              </h1>
              <h1 className="text-center" style={{marginTop:"2em"}}>
                <Link to="/" style={{color:"blue"}}>Go to Home</Link>
              </h1>
            </section>
          }
        />
      </Routes>
    </>
  );
}

export default App;
