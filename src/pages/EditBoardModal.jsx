import React, { useState, useEffect } from "react";
import styles from "./styles/EditBoardModal.module.css";

export const EditBoardModal = ({ isOpen, onClose, onEdit, board }) => {
  const [newBoardName, setNewBoardName] = useState("");

  useEffect(() => {
    if (board) {
      setNewBoardName(board.name);
    }
  }, [board]);

  const handleSubmit = () => {
    if (!newBoardName.trim()) return;
    onEdit(board.id, newBoardName); 
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Edit Board Name</h2>
        <input
          type="text"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          placeholder="Enter new board name"
          className={styles.input}
        />
        <div className={styles.modalButtons}>
          <button onClick={handleSubmit} className={styles.saveButton}>Save</button>
          <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
