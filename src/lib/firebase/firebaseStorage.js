// src/components/ProfilePhotoUploader.jsx
import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL,listAll,deleteObject } from "firebase/storage";
import { storage } from "../../firebase/firebaseConfig"; // Import storage
import { useUpdateTodo } from "../tanstackQuery/tanstackQuery";
import { updateProfile } from "firebase/auth"; // To update user's profile with photoURL
import { useGlobalContext } from "../../Hooks/GlobalDataContext";
import KEYS from "../constants"

const useUploadFile = () => {
  //   const [file, setFile] = useState(null);
  const { mutateAsync: updatePinnedIDs } = useUpdateTodo();
  const { Toast } = useGlobalContext();

async function handleUpload(currentUser, file) {
    const extension=file.name.split(".").pop()
    await deleteOldProfilePhotos(currentUser.uid)
    const storageRef = ref(
      storage,
      `${KEYS.firebaseStorageStr.pathName}/${currentUser.uid}/${KEYS.firebaseStorageStr.profileName}.${extension}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      async (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (uploadError) => {
        // Handle unsuccessful uploads
        console.error("Upload Error:", uploadError);
      },
      async () => {
        // Handle successful uploads on complete
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // NOTE: Optional: Update the user's profile photoURL in Firebase Auth
          await updateProfile(currentUser, { photoURL: downloadURL });
          console.log("User profile photoURL updated in Firebase Auth.");

          const updateDatabse = async () => {
            try {
              await updatePinnedIDs({
                docId: currentUser.uid,
                dataObj: { avatarURL: downloadURL },
              });
              Toast.success("Profile picture uploaded successfully");
            } catch (error) {
              console.error("error:", error);
              Toast.error(error);
            }
          };
          updateDatabse();
        } catch (downloadError) {
          console.error(
            "Error getting download URL or updating profile:",
            downloadError
          );
        }
      }
    );
  }
  return { handleUpload };
};


async function deleteOldProfilePhotos(uid) {
  const folderRef = ref(storage, `${KEYS.firebaseStorageStr.pathName}/${uid}`);
  const list = await listAll(folderRef);

  const deletes = list.items
    .filter(item => item.name.startsWith(KEYS.firebaseStorageStr.profileName))
    .map(item => deleteObject(item).catch(err => {
      if (err.code !== "storage/object-not-found") {
        console.error("Delete error:", err);
      }
      console.log("err", err);
    }));

  await Promise.all(deletes);
}


export default useUploadFile;
