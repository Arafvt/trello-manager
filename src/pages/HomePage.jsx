import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchBoards, 
  createBoard, 
  removeBoard, 
  editBoard 
} from "../store/boardsSlice";
import { AddBoardModal } from "./AddBoardModal";
import { EditBoardModal } from "./EditBoardModal";
import styles from "./styles/HomePage.module.css";

export const HomePage = () => {
  const dispatch = useDispatch();
  const { items: boards, status, error } = useSelector(state => state.boards);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentBoard, setCurrentBoard] = useState(null);

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  const handleAddBoard = (boardName) => {
    if (!boardName.trim()) return;
    dispatch(createBoard(boardName));
    setIsModalOpen(false);
  };

  const handleDeleteBoard = (id) => {
    dispatch(removeBoard(id));
  };

  const handleEditBoard = (boardId, newName) => {
    if (!newName.trim()) return;
    dispatch(editBoard({ id: boardId, newName }));
    setIsEditModalOpen(false);
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
            <Link to={`/board/${board.id}`} className={styles.boardLink}>{board.name}</Link>
            <button className={styles.deleteBtn} onClick={() => handleDeleteBoard(board.id)}>X</button>
            <button className={styles.editBtn} onClick={() => openEditModal(board)}>✎</button>
          </div>
        ))}
        <button className={styles.addBoard} onClick={() => setIsModalOpen(true)}>+ Add a board</button>
      </div>
      <AddBoardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddBoard} />
      <EditBoardModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onEdit={handleEditBoard} board={currentBoard} />
    </div>
  );
};