import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";  
import { getColumns, addColumn, deleteColumn, updateColumn } from "../api/api";
import { Task } from "./Task";
import styles from "./styles/Boards.module.css";

export const Boards = ({ boardId, boardName }) => {
  const [columns, setColumns] = useState([]);
  const [newColumnName, setNewColumnName] = useState("");
  const [editingColumn, setEditingColumn] = useState(null);
  const [editedColumnName, setEditedColumnName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadColumns = async () => {
      try {
        const data = await getColumns(boardId);
        setColumns(data);
        setError("");
      } catch (err) {
        setError("Failed to load columns.");
      }
    };
    loadColumns();
  }, [boardId]);

  const handleAddColumn = async () => {
    if (!newColumnName.trim()) return;
    try {
      const newColumn = await addColumn(boardId, newColumnName);
      setColumns([...columns, newColumn]);
      setNewColumnName("");
      setError("");
    } catch (err) {
      setError("Failed to add column.");
    }
  };

  const handleDeleteColumn = async (columnId) => {
    try {
      await deleteColumn(columnId);
      setColumns(columns.filter(column => column.id !== columnId));
      setError("");
    } catch (err) {
      setError("Failed to delete column.");
    }
  };

  const handleUpdateColumn = async (columnId) => {
    if (!editedColumnName.trim()) return;
    try {
      await updateColumn(columnId, editedColumnName);
      setColumns(columns.map(col => col.id === columnId ? { ...col, name: editedColumnName } : col));
      setEditingColumn(null);
      setError("");
    } catch (err) {
      setError("Failed to update column.");
    }
  };

  return (
    <div className={styles.boardContainer}>
      <Link to="/" className={styles.backLink}>Back to Home</Link>
      <h1 className={styles.boardTitle}>{boardName}</h1>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.columns}>
        {columns.map((column) => (
          <div key={column.id} className={styles.column}>
            <div className={styles.columnHeader}>
              {editingColumn === column.id ? (
                <>
                  <input
                    type="text"
                    value={editedColumnName}
                    onChange={(e) => setEditedColumnName(e.target.value)}
                    className={styles.columnInput}
                  />
                  <button
                    onClick={() => handleUpdateColumn(column.id)}
                    className={styles.saveBtn}
                  >
                    ✔
                  </button>
                </>
              ) : (
                <h2 onDoubleClick={() => {
                  setEditingColumn(column.id);
                  setEditedColumnName(column.name);
                }} className={styles.columnTitle}>
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
        ))}
      </div>
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
