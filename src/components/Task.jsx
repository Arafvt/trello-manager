import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  fetchTasks,
  createTask,
  removeTask,
  editTask,
  reorderTasks
} from "../store/tasksSlice";
import styles from "./styles/Task.module.css";

export const Task = ({ columnId }) => {
  const dispatch = useDispatch();
  const { items: tasks, status, error } = useSelector((state) => state.tasks);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  const columnTasks = useMemo(
    () => tasks.filter((task) => String(task.columnId) === String(columnId)),
    [tasks, columnId]
  );

  useEffect(() => {
    if (!columnTasks.length || columnTasks.some((task) => String(task.columnId) !== String(columnId))) {
      dispatch(fetchTasks(columnId));
    }
  }, [columnId, dispatch]);

  const handleAddTask = useCallback(() => {
    if (!newTaskName.trim()) return;
    dispatch(createTask({ columnId, name: newTaskName }));
    setNewTaskName("");
  }, [newTaskName, columnId, dispatch]);

  const handleDeleteTask = useCallback((taskId) => {
    dispatch(removeTask(taskId));
  }, [dispatch]);

  const handleUpdateTask = useCallback((taskId) => {
    if (!editedTaskName.trim()) return;
    dispatch(editTask({ taskId, newName: editedTaskName }));
  }, [editedTaskName, dispatch]);

  const onDragEnd = useCallback(
    async (result) => {
      if (!result.destination) return;
      
      const draggedTask = columnTasks.find(t => String(t.id) === result.draggableId);
      if (!draggedTask) return;
  
      const reorderedTasks = Array.from(columnTasks);
      const [removed] = reorderedTasks.splice(result.source.index, 1);
      reorderedTasks.splice(result.destination.index, 0, removed);
  
      try {
        await dispatch(
          reorderTasks({
            columnId,
            tasks: reorderedTasks.map((task, index) => ({
              id: task.id,
              order: index,
            })),
          })
        );
      } catch (error) {
        console.error("Reorder failed:", error);
      }
    },
    [columnTasks, columnId, dispatch]
  );

  if (status === "loading") {
    return <div>Loading tasks...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={String(columnId)}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={styles.tasksContainer}
        >
          {status === "loading" && <div>Loading tasks...</div>}
          {status === "succeeded" && columnTasks.length === 0 && (
            <div className={styles.noTasks}>No tasks yet</div>
          )}
          {columnTasks.map((task, index) => (
            <Draggable
              key={String(task.id)}
              draggableId={String(task.id)}
              index={index}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={styles.task}
                >
                  {editingTaskId === task.id ? (
                    <>
                      <input
                        type="text"
                        value={editedTaskName}
                        onChange={(e) => setEditedTaskName(e.target.value)}
                        className={styles.taskInput}
                      />
                      <button
                        onClick={() => handleUpdateTask(task.id)}
                        className={styles.saveBtn}
                      >
                        ✔️
                      </button>
                    </>
                  ) : (
                    <>
                      <span
                        onDoubleClick={() => {
                          setEditingTaskId(task.id);
                          setEditedTaskName(task.name);
                        }}
                      >
                        {task.name}
                      </span>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className={styles.deleteBtn}
                      >
                        х
                      </button>
                    </>
                  )}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}

          {!isAddingTask ? (
            <span
              onClick={() => setIsAddingTask(true)}
              className={styles.addTaskText}
            >
              + Add Task
            </span>
          ) : (
            <div className={styles.addTaskInputContainer}>
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                className={styles.taskInput}
                placeholder="Enter task name"
              />
              <button onClick={handleAddTask} className={styles.addTaskBtn}>
                Add
              </button>
              <button
                onClick={() => {
                  setIsAddingTask(false);
                  setNewTaskName("");
                }}
                className={styles.cancelBtn}
              >
                х
              </button>
            </div>
          )}
        </div>
      )}
    </Droppable>
    </DragDropContext>
    
  );
};