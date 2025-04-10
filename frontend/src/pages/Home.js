import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import Task from './Task';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [newUsername, setNewUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('https://auth-mern-app-delta.vercel.app/tasks', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = await response.json();
            
            if (result.success) {
                setTasks(result.tasks);
            } else {
                handleError('Failed to fetch tasks');
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    const createTask = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://auth-mern-app-delta.vercel.app/tasks/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newTask)
            });
            
            const result = await response.json();
            if (result.success) {
                handleSuccess('Task created successfully');
                setNewTask({ title: '', description: '' });
                fetchTasks();
            } else {
                handleError('Failed to create task');
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone!');
        if (!confirmDelete) return;

        try {
            const response = await fetch('https://auth-mern-app-delta.vercel.app/auth/delete-account', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            const result = await response.json();
            if (result.success) {
                handleSuccess(result.message);
                localStorage.removeItem('token');
                localStorage.removeItem('loggedInUser');
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    const handleUsernameChange = async (e) => {
        e.preventDefault();
        if (!newUsername.trim()) {
            return handleError('Please enter a valid username');
        }

        try {
            const response = await fetch('https://auth-mern-app-delta.vercel.app/auth/change-username', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ newName: newUsername })
            });

            const result = await response.json();
            if (result.success) {
                handleSuccess(result.message);
                localStorage.setItem('loggedInUser', result.newName);
                setLoggedInUser(result.newName);
                setNewUsername('');
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome {loggedInUser}</h1>
                <div className="header-actions">
                    <button 
                        onClick={handleDeleteAccount}
                        className="delete-btn"
                    >
                        Delete Account
                    </button>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </header>

            <div className="task-form">
                <h2>Create New Task</h2>
                <form onSubmit={createTask}>
                    <input
                        type="text"
                        placeholder="Task title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        required
                    />
                    <textarea
                        placeholder="Task description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    />
                    <button type="submit" className="create-btn">Add Task</button>
                </form>
            </div>

            <div className="tasks-list">
                <h2>Your Tasks</h2>
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <Task key={task._id} task={task} fetchTasks={fetchTasks} />
                    ))
                ) : (
                    <p className="no-tasks">No tasks found. Start by creating one!</p>
                )}
            </div>

            <div className="account-actions">
                <form onSubmit={handleUsernameChange} className="username-form">
                    <input
                        type="text"
                        placeholder="Enter new username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                    />
                    <button type="submit" className="update-btn">
                        Update Username
                    </button>
                </form>
            </div>

            <ToastContainer />
        </div>
    )
}

export default Home;