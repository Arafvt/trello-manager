import React, { useEffect, useState } from "react";
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
  const handleAddColumn = async () => {
    if (!newColumnName.trim()) return;
    try {
      await dispatch(createColumn({ boardId, name: newColumnName })).unwrap();
      setNewColumnName("");
    } catch (err) {
      console.error("Failed to add column:", err);
    }
  };

  const handleDeleteColumn = (columnId) => {
    dispatch(removeColumn(columnId));
  };

  const handleUpdateColumn = (columnId) => {
    if (!editedColumnName.trim()) return;
    dispatch(editColumn({ columnId, newName: editedColumnName }));
    setEditingColumn(null);
  };

  if (status === 'loading') {
    return <div>Loading columns...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

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
