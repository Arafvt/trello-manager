import React, { useEffect, useState } from "react";
import { getTasks, addTask, deleteTask, updateTask } from "../api/api"; 
import styles from "./styles/Task.module.css"; 

export const Task = ({ columnId }) => {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);  
  const [newTaskName, setNewTaskName] = useState(""); 
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await getTasks(columnId);
        setTasks(data);
        setError("");
      } catch (err) {
        setError("Failed to load tasks.");
      }
    };
    loadTasks();
  }, [columnId]);

  const handleAddTask = async () => {
    if (!newTaskName.trim()) return;
    try {
      const newTask = await addTask(columnId, newTaskName);
      setTasks(prev => [...prev, newTask]);
      setNewTaskName("");
      setIsAddingTask(false);
      setError("");
    } catch (err) {
      setError("Failed to add task.");
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      setError("");
    } catch (err) {
      setError("Failed to delete task.");
    }
  };
  
  const handleUpdateTask = async (taskId) => {
    if (!editedTaskName.trim()) return;
    try {
      await updateTask(taskId, editedTaskName);
      setTasks(prev =>
        prev.map(task => task.id === taskId ? { ...task, name: editedTaskName } : task)
      );
      setEditingTaskId(null);
      setError("");
    } catch (err) {
      setError("Failed to update task.");
    }
  };

  const handleCancelAddTask = () => {
    setIsAddingTask(false); 
    setNewTaskName(""); 
  };

  return (
    <div className={styles.tasksContainer}>
      {error && <div className={styles.error}>{error}</div>}
      {tasks.map((task) => (
        <div key={task.id} className={styles.task}>
          {editingTaskId === task.id ? (
            <>
              <input
                type="text"
                value={editedTaskName}
                onChange={(e) => setEditedTaskName(e.target.value)}
                className={styles.taskInput}
              />
              <button onClick={() => handleUpdateTask(task.id)} className={styles.saveBtn}>
                ✔
              </button>
            </>
          ) : (
            <>
              <span onDoubleClick={() => {
                setEditingTaskId(task.id);
                setEditedTaskName(task.name);
              }}>
                {task.name}
              </span>
              <button onClick={() => handleDeleteTask(task.id)} className={styles.deleteBtn}>
                х
              </button>
            </>
          )}
        </div>
      ))}
      
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
          <button onClick={handleAddTask} className={styles.addTaskBtn}>Add</button>
          <button onClick={handleCancelAddTask} className={styles.cancelBtn}>х</button>
        </div>
      )}
    </div>
  );
};
