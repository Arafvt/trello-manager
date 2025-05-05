import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchColumns,
  createColumn,
  removeColumn,
  editColumn
} from "../store/columnsSlice";
import { Task } from "./Task";
import styles from "./styles/Boards.module.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export const Boards = ({ boardId, boardName }) => {
  const dispatch = useDispatch();
  const { items: allColumns, status, error } = useSelector(state => state.columns);
  const [newColumnName, setNewColumnName] = useState("");
  const [editingColumn, setEditingColumn] = useState(null);
  const [editedColumnName, setEditedColumnName] = useState("");

  const columns = allColumns.filter(column => String(column.boardId) === String(boardId));

  useEffect(() => {
    dispatch(fetchColumns(boardId));
  }, [boardId, dispatch]);

  const handleAddColumn = useCallback(async () => {
    if (!newColumnName.trim()) return;
    try {
      await dispatch(createColumn({ boardId, name: newColumnName })).unwrap();
      setNewColumnName("");
    } catch (err) {
      console.error("Failed to add column:", err);
    }
  }, [dispatch, boardId, newColumnName]);

  const handleDeleteColumn = useCallback((columnId) => {
    dispatch(removeColumn(columnId));
  }, [dispatch]);

  const handleUpdateColumn = useCallback((columnId) => {
    if (!editedColumnName.trim()) return;
    dispatch(editColumn({ columnId, newName: editedColumnName }));
    setEditingColumn(null);
  }, [dispatch, editedColumnName]);

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;
    const reordered = Array.from(columns);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
  }, [columns]);

  return (
    <div className={styles.boardContainer}>
      <div className={styles.boardHeader}>
          <h1 className={styles.boardTitle}>{boardName}</h1>
          <Link to="/" className={styles.backLink}>
            Home
          </Link>
        </div>
      {error && <div className={styles.error}>{error}</div>}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="columns" direction="horizontal">
          {(provided) => (
            <div
              className={styles.columns}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {columns.map((column, index) => (
                <Draggable key={column.id} draggableId={String(column.id)} index={index}>
                  {(provided) => (
                    <div
                      className={styles.column}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className={styles.columnHeader}>
                        {editingColumn === column.id ? (
                          <>
                            <input
                              type="text"
                              value={editedColumnName}
                              onChange={(e) => setEditedColumnName(e.target.value)}
                              className={styles.columnInput}
                            />
                            <button onClick={() => handleUpdateColumn(column.id)} className={styles.saveBtn}>✔️</button>
                          </>
                        ) : (
                          <h2
                            onDoubleClick={() => {
                              setEditingColumn(column.id);
                              setEditedColumnName(column.name);
                            }}
                            className={styles.columnTitle}
                          >
                            {column.name}
                          </h2>
                        )}
                        <button
                          className={styles.deleteColumnBtn}
                          onClick={() => handleDeleteColumn(column.id)}
                        >
                          X
                        </button>
                      </div>
                      <Task columnId={column.id} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className={styles.addColumn}>
        <input
          type="text"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
          placeholder="Enter column name"
        />
        <button onClick={handleAddColumn}>Add Column</button>
      </div>
    </div>
  );
};