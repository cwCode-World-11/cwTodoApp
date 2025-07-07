import { useEffect, useState } from "react";
import "./Modal.css"; // Ensure to create a separate CSS file for styles

const EditCategoryModal = ({
  isEditOpen,
  setIsEditOpen,
  editName,
  handleEditCategory,
}) => {
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (editName) setCategoryName(editName);
  }, [isEditOpen]);

  if (!isEditOpen) return null;

  const handleClose = () => {
    setCategoryName("");
    setIsEditOpen(false);
    return;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Category</h2>
        <input
          type="text"
          placeholder="Edit Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          autoFocus
        />
        <div className="btnGroup">
          <button onClick={handleClose} className="modal-button cancel">
            Cancel
          </button>
          <button
            onClick={() => handleEditCategory(categoryName, setCategoryName)}
            className="modal-button">
            Edit Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;
