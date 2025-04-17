import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBoards, addBoard, deleteBoard, updateBoard } from "../api/boardsApi";
import { AddBoardModal } from "./AddBoardModal";
import { EditBoardModal } from "./EditBoardModal";
import styles from "./styles/HomePage.module.css";

export const HomePage = () => {
  const [boards, setBoards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBoards = async () => {
      try {
        const boardsData = await getBoards();
        setBoards(boardsData);
        setError("");
      } catch (err) {
        setError("Failed to load boards.");
      }
    };
    loadBoards();
  }, []);

  const handleAddBoard = async (boardName) => {
    if (!boardName.trim()) return;
    try {
      const newBoard = await addBoard(boardName);
      setBoards(prev => [...prev, newBoard]);
      setIsModalOpen(false);
      setError("");
    } catch (err) {
      setError("Failed to add board.");
    }
  };

  const handleDeleteBoard = async (id) => {
    try {
      await deleteBoard(id);
      setBoards(prev => prev.filter(board => board.id !== id));
      setError("");
    } catch (error) {
      console.error("Error deleting board:", error);
      setError("Failed to delete board.");
    }
  };

  const handleEditBoard = async (boardId, newName) => {
    if (!newName.trim()) return;
    try {
      const updatedBoard = await updateBoard(boardId, newName);
      setBoards(prev =>
        prev.map(board => board.id === boardId ? updatedBoard : board)
      );
      setIsEditModalOpen(false);
      setError("");
    } catch (error) {
      console.error("Error updating board:", error);
      setError("Failed to update board.");
    }
  };

  const openEditModal = (board) => {
    setCurrentBoard(board);
    setIsEditModalOpen(true);
  };

  return (
    <div className={styles.homeContainer}>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.boardList}>
        {boards.map((board) => (
          <div key={board.id} className={styles.boardItem}>
            <Link to={`/board/${board.id}`} className={styles.boardLink}>
              {board.name}
            </Link>
            <button className={styles.deleteBtn} onClick={() => handleDeleteBoard(board.id)}>
              X
            </button>
            <button className={styles.editBtn} onClick={() => openEditModal(board)}>
              ✎
            </button>
          </div>
        ))}
        <button className={styles.addBoard} onClick={() => setIsModalOpen(true)}>
          + Add a board
        </button>
      </div>

      <AddBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddBoard}
      />

      <EditBoardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditBoard}
        board={currentBoard}
      />
    </div>
  );
};
