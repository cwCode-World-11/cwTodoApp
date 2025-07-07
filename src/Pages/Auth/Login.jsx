import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../Hooks/GlobalDataContext";
import { logIn } from "../../lib/firebase/auth";
import { LineWave } from "react-loader-spinner";
import "./Auth.css"; // For styling, similar to the design

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { Toast } = useGlobalContext();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const { email, password } = e.target;

    try {
      const login = await logIn(email.value, password.value);
      if (login) {
        navigate("/");
        Toast.success("You were logged into your account");
      } else {
        Toast.error("There was a problem logging you in. Please try again!");
      }
    } catch (error) {
      console.error("error:", error);
      Toast.error("Error: " + error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
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
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
        <div className="switch-text">
          <Link to="/forgetPassword">Forget Password?</Link>
        </div>
        <p className="switch-text">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
