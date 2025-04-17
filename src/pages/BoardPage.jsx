import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Boards } from "../components/Boards";
import { getBoards } from "../api/boardsApi";

export const BoardPage = () => {
  const { id } = useParams();
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const loadBoard = async () => {
      const boards = await getBoards();
      const foundBoard = boards.find((board) => board.id === id);

      setBoard(foundBoard);
    };

    loadBoard();
  }, [id]);

  if (!board) return <p>Board not found</p>;

  return <Boards boardId={board.id} boardName={board.name} />;
};
