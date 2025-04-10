import React, { useState } from 'react';
import { handleError, handleSuccess } from '../utils';

const Task = ({ task, fetchTasks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDesc, setEditedDesc] = useState(task.description);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://auth-mern-app-1p4n.onrender.com/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: editedTitle,
          description: editedDesc
        })
      });
      
      const result = await response.json();
      if (result.success) {
        handleSuccess('Task updated successfully');
        fetchTasks();
        setIsEditing(false);
      }
    } catch (err) {
      handleError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://auth-mern-app-1p4n.onrender.com/tasks/${task._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const result = await response.json();
      if (result.success) {
        handleSuccess('Task deleted successfully');
        fetchTasks();
      }
    } catch (err) {
      handleError(err.message);
    }
  };

  const toggleStatus = async () => {
    try {
      const response = await fetch(`https://auth-mern-app-1p4n.onrender.com/tasks/${task._id}/done`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const result = await response.json();
      if (result.success) {
        handleSuccess(`Task marked as ${result.task.status ? 'done' : 'pending'}`);
        fetchTasks();
      }
    } catch (err) {
      handleError(err.message);
    }
  };

  return (
    <div className={`task-item ${task.status ? 'completed' : ''}`}>
      {isEditing ? (
        <div className="edit-form">
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Task title"
          />
          <textarea
            value={editedDesc}
            onChange={(e) => setEditedDesc(e.target.value)}
            placeholder="Task description"
          />
          <div className="task-actions">
            <button onClick={handleUpdate} className="save-btn">Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-content">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <span className="task-status">
              Status: {task.status ? '✅ Completed' : '⏳ Pending'}
            </span>
          </div>
          <div className="task-actions">
            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
            <button onClick={toggleStatus} className="status-btn">
              {task.status ? 'Mark Pending' : 'Mark Done'}
            </button>
            <button onClick={handleDelete} className="delete-btn">Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Task;