import { useRef } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../../lib/firebase/auth";
import { useGlobalContext } from "../../Hooks/GlobalDataContext";
import "./Auth.css";

const ForgetPassword = () => {
  const emailRef = useRef();

  const { Toast } = useGlobalContext();

  async function handlePasswordReset(e) {
    e.preventDefault();
    const email = emailRef.current.value;
    if (!email) {
      return Toast.error("Please don't leave blank email field");
    }
    try {
      await resetPassword(email);
      return Toast.log("Check your email");
    } catch (error) {
      console.log("error:", error);
      return Toast.error("Failed to reset");
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <form>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              ref={emailRef}
            />
          </div>
          <button
            type="submit"
            className="auth-btn"
            onClick={handlePasswordReset}>
            Reset Password
          </button>
        </form>
        <p className="switch-text">
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
