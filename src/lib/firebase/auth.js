import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

async function signUp(email, password) {
  try {
    const signUp = await createUserWithEmailAndPassword(auth, email, password);
    return signUp;
  } catch (error) {
    console.error("error:", error);
  }
}

async function logIn(email, password) {
  try {
    const logIn = await signInWithEmailAndPassword(auth, email, password);
    return logIn;
  } catch (error) {
    console.error("error:", error);
  }
}

async function logOut() {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error("error:", error);
  }
}

async function resetPassword(email) {
  try {
    const sndEmail = await sendPasswordResetEmail(auth, email);
    console.log("sndEmail:", sndEmail);
  } catch (error) {
    console.error("error:", error);
  }
}

export { signUp, logIn, logOut, resetPassword };
