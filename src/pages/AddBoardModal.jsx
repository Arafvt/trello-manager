import React, { useState } from "react";
import styles from "./styles/AddBoardModal.module.css";

export const AddBoardModal = ({ isOpen, onClose, onAdd }) => {
  const [boardName, setBoardName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!boardName.trim()) return; 
    onAdd(boardName);
    setBoardName(""); 
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Add board</h2>
        <input
          type="text"
          placeholder="Enter name"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
        />
        <div className={styles.modalButtons}>
          <button onClick={handleSubmit} className={styles.addButton}>Add</button>
          <button onClick={onClose} className={styles.cancelButton}>Back</button>
        </div>
      </div>
    </div>
  );
};
