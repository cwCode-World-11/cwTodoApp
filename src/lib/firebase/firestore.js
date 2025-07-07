import { setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { firestoreDatabase } from "../../firebase/firebaseConfig";

export async function saveUserToDB(uid, userObj) {
  try {
    const docRef = doc(firestoreDatabase, "Users", uid);
    await setDoc(docRef, userObj); //doesn't return saved document
    return true;
  } catch (error) {
    console.error("error:", error);
    return null;
  }
}

export async function getUserFromDB(docId) {
  try {
    const user = await getDoc(doc(firestoreDatabase, "Users", docId));
    return { ...user.data(), docId };
  } catch (error) {
    console.error("error:", error);
    return null;
  }
}

export async function updateAddCategory(docId, categoryList) {
  try {
    // Update list function goes here
    await updateDoc(doc(firestoreDatabase, "Users", docId), {
      categories: categoryList,
    });
  } catch (error) {
    console.error("error:", error);
  }
}

export async function addNewTodo(docId, todoObj) {
  try {
    await updateDoc(doc(firestoreDatabase, "Users", docId), {
      todos: arrayUnion(todoObj),
    });
  } catch (error) {
    console.error("Error: ", error);
  }
}

export async function getTodos(docId) {
  try {
    const snapShot = await getDoc(doc(firestoreDatabase, "Users", docId));
    const todos = { ...snapShot.data(), docId: snapShot.id };
    return todos;
  } catch (error) {
    console.error("error:", error);
  }
}

export async function editTodo(docId, todos) {
  try {
    await updateDoc(doc(firestoreDatabase, "Users", docId), {
      todos,
    });
  } catch (error) {
    console.error("error:", error);
  }
}

export async function updateTodo(docId, dataObj) {
  try {
    await updateDoc(doc(firestoreDatabase, "Users", docId), dataObj); //NOTE: dataObj={fieldName:value}
  } catch (error) {
    console.error("error:", error);
  }
}
