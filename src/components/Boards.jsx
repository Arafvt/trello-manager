import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  fetchColumns,
  createColumn,
  removeColumn,
  editColumn,
  reorderColumns
} from "../store/columnsSlice";
import { Task } from "./Task";
import styles from "./styles/Boards.module.css";

export const Boards = ({ boardId, boardName }) => {
  const dispatch = useDispatch();
  const { items: allColumns, status, error } = useSelector((state) => state.columns);
  const [newColumnName, setNewColumnName] = useState("");
  const [editingColumn, setEditingColumn] = useState(null);
  const [editedColumnName, setEditedColumnName] = useState("");

  const columns = useMemo(
    () => allColumns.filter((column) => String(column.boardId) === String(boardId)),
    console.log('Current boardId:', boardId, 'type:', typeof boardId),
    console.log('All columns:', allColumns),
    [allColumns, boardId]
  );

  useEffect(() => {
    if (!columns.length || columns.some((col) => String(col.boardId) !== String(boardId))) {
      dispatch(fetchColumns(boardId));
    }
  }, [boardId, dispatch]);

  const handleAddColumn = useCallback(async () => {
    if (!newColumnName.trim()) return;
    await dispatch(createColumn({ boardId, name: newColumnName }));
    setNewColumnName("");
  }, [newColumnName, boardId, dispatch]);

  const handleDeleteColumn = useCallback((columnId) => {
    dispatch(removeColumn(columnId));
  }, [dispatch]);

  const handleUpdateColumn = useCallback((columnId) => {
    if (!editedColumnName.trim()) return;
    dispatch(editColumn({ columnId, newName: editedColumnName }));
    setEditingColumn(null);
  }, [editedColumnName, dispatch]);

  const onDragEnd = useCallback(async (result) => {
    console.log('Drag result:', JSON.stringify(result, null, 2));
    console.log('Current columns:', columns.map(c => ({ id: c.id, name: c.name })));
  
    if (!result.destination) {
      console.log('Drop outside droppable area');
      return;
    }
  
    const { source, destination, draggableId } = result;
  
    if (source.index === destination.index) {
      console.log('No position change');
      return;
    }
  
    const draggedColumn = columns.find(c => String(c.id) === String(draggableId));
    if (!draggedColumn) {
      console.error(`Column ${draggableId} not found. Available columns:`, 
        columns.map(c => c.id));
      return;
    }
  
    const reorderedColumns = Array.from(columns);
    const [removed] = reorderedColumns.splice(source.index, 1);
    reorderedColumns.splice(destination.index, 0, removed);
  
    console.log('New order:', reorderedColumns.map(c => c.id));
  
    try {
      await dispatch(
        reorderColumns({
          boardId,
          columns: reorderedColumns.map((col, index) => ({
            id: col.id,
            order: index,
          })),
        })
      );
      console.log('Reorder successful');
    } catch (error) {
      console.error('Reorder failed:', error);
    }
  }, [columns, boardId, dispatch]);

  if (status === "loading") {
    return <div>Loading columns...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.boardContainer}>
        <Link to="/" className={styles.backLink}>
          Back to Home
        </Link>
        <h1 className={styles.boardTitle}>{boardName}</h1>
        {error && <div className={styles.error}>{error}</div>}

        <Droppable droppableId="columns" direction="horizontal" isCombineEnabled={false}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={styles.columns}
            >
              {columns.map((column, index) => (
                <Draggable
                  key={String(column.id)}
                  draggableId={String(column.id)}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={styles.column}
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
                            <button
                              onClick={() => handleUpdateColumn(column.id)}
                              className={styles.saveBtn}
                            >
                              ✔️
                            </button>
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
    </DragDropContext>
    
  );
};