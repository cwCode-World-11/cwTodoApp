import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaHome, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useGlobalContext } from "../Hooks/GlobalDataContext";
import { logOut } from "../lib/firebase/auth";
import "./Sidebar.css";

const Sidebar = () => {
  const { Toast } = useGlobalContext();
  const navigate = useNavigate();

  async function handleLogOut() {
    try {
      await logOut();
      navigate("/login");
      Toast.log("Logged out");
    } catch (error) {
      console.error("error:", error);
      Toast.error("Failed to logout!");
    }
  }

  return (
    <>
      <div style={{ display: "flex" }}>
        <section
          style={{
            backgroundColor: "rgb(34, 34, 34)",
            height: "100vh",
            padding: "1.5em",
            display: "flex",
            flexDirection: "column",
            width: "20vw",
            justifyContent: "space-between",
            // alignItems: "center",
            // alignContent: "center",
          }}>
          <div>
            <div>
              <h3 className="logo">cwTodoApp</h3>
            </div>
            <Link to="/">
              <div className="navLink">
                <FaHome />
                <span>Home</span>
              </div>
            </Link>
            <Link to="/profile">
              <div className="navLink">
                <FaUserCircle />
                <span>Profile</span>
              </div>
            </Link>
          </div>
          <div className="logOutDiv" onClick={handleLogOut}>
            <FaSignOutAlt />
            <span>Logout</span>
          </div>
        </section>
        <section>
          <Outlet />
        </section>
      </div>
    </>
  );
};

export default Sidebar;
