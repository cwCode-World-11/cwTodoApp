import { useState } from "react";
import "./Auth.css"; // For styling, similar to the design
import { useGlobalContext } from "../../Hooks/GlobalDataContext";
import { signUp } from "../../lib/firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useSaveUserToDB } from "../../lib/tanstackQuery/tanstackQuery";

const Signup = () => {
  const { mutateAsync: saveUserToFirestore } = useSaveUserToDB();
  const [isLoading, setIsLoading] = useState(false);

  const { Toast } = useGlobalContext();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const { email, password, confirmPassword, username } = e.target;
    try {
      // Validation check
      if (password.value !== confirmPassword.value) {
        return Toast.error("Password doesn't match");
      }

      // Creating user
      const createUser = await signUp(email.value, password.value);
      if (createUser) {
        // Save user to firestore
        Toast.success("Successfully account created");
        // Default user object
        const userObj = {
          setting: {},
          username: username.value,
          email: createUser.user.email,
          categories: [],
          pinnedTodos: [],
          todos: [],
        };
        const saveUser = await saveUserToFirestore({
          uid: createUser.user.uid, //we pass as a argument
          userObj,
        });

        if (saveUser) {
          navigate("/");
          Toast.log("User info stored in database and navigated to home page");
        } else Toast.error("Failed to store an account in database!");
      } else {
        Toast.error("Failed to create an account!");
      }
    } catch (error) {
      console.error("error:", error);
      Toast.error("Failed to signup : " + error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Create a password"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Password Confirmation"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Choose a username"
              required
            />
          </div>
          <input
            type="submit"
            className="auth-btn"
            value={isLoading ? "Loading..." : "Sign Up"}
            disabled={isLoading}
          />
        </form>
        <p className="switch-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
