import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Boards } from "../components/Boards";
import { fetchBoards } from "../store/boardsSlice";

export const BoardPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const boards = useSelector(state => state.boards.items);
  const board = boards.find(board => board.id === id);

  useEffect(() => {
    if (boards.length === 0) {
      dispatch(fetchBoards());
    }
  }, [dispatch, boards.length]);

  if (!board) return <p>Board not found</p>;

  return <Boards boardId={board.id} boardName={board.name} />;
};