import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  createTask,
  removeTask,
  editTask
} from "../store/tasksSlice";
import styles from "./styles/Task.module.css";
import { Droppable, Draggable } from "react-beautiful-dnd";

export const Task = ({ columnId }) => {
  const dispatch = useDispatch();
  const { items: tasks, status } = useSelector(state => state.tasks);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  const columnTasks = tasks
    .filter(task => String(task.columnId) === String(columnId));

  useEffect(() => {
    dispatch(fetchTasks(columnId));
  }, [columnId, dispatch]);

  const handleAddTask = () => {
    if (!newTaskName.trim()) return;
    dispatch(createTask({ columnId, name: newTaskName }));
    setNewTaskName("");
    setIsAddingTask(false);
  };

  const handleDeleteTask = (taskId) => {
    dispatch(removeTask(taskId));
  };

  const handleUpdateTask = (taskId) => {
    if (!editedTaskName.trim()) return;
    dispatch(editTask({ taskId, newName: editedTaskName }));
    setEditingTaskId(null);
  };

  if (status === 'loading') return <div>Loading tasks...</div>;
  if (status === 'failed') return <div>Error loading tasks</div>;

  return (
    <Droppable droppableId={String(columnId)} type="task">
      {(provided) => (
        <div
          className={styles.tasksContainer}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {columnTasks.length === 0 && status === 'succeeded' && (
            <div className={styles.noTasks}>No tasks yet</div>
          )}
          {columnTasks.map((task, index) => (
            <Draggable key={task.id} draggableId={String(task.id)} index={index}>
              {(provided) => (
                <div
                  className={styles.task}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  {editingTaskId === task.id ? (
                    <>
                      <input
                        type="text"
                        value={editedTaskName}
                        onChange={(e) => setEditedTaskName(e.target.value)}
                        className={styles.taskInput}
                      />
                      <button onClick={() => handleUpdateTask(task.id)} className={styles.saveBtn}>✔️</button>
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
                      <button onClick={() => handleDeleteTask(task.id)} className={styles.deleteBtn}>х</button>
                    </>
                  )}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}

          {!isAddingTask ? (
            <span onClick={() => setIsAddingTask(true)} className={styles.addTaskText}>+ Add Task</span>
          ) : (
            <div className={styles.addTaskInputContainer}>
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                className={styles.taskInput}
                placeholder="Enter task name"
              />
              <div className={styles.buttonsRow}>
                <button 
                  onClick={handleAddTask} 
                  className={styles.addTaskBtn}
                  disabled={!newTaskName.trim()}
                >
                  Add Task
                </button>
                <button
                  onClick={() => {
                    setIsAddingTask(false);
                    setNewTaskName("");
                  }}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Droppable>
  );
};