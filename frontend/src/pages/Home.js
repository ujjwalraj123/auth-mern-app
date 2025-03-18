import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [products, setProducts] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, [])

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone!');
        if (!confirmDelete) return;

        try {
            const response = await fetch('https://auth-mern-1nvpq2abk-ujjwal-rajs-projects-a7446681.vercel.app/auth/delete-account', {
                method: 'DELETE',
                headers: {
                    'Authorization': localStorage.getItem('token')
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
    }

    const handleUsernameChange = async (e) => {
        e.preventDefault();
        if (!newUsername.trim()) {
            return handleError('Please enter a valid username');
        }

        try {
            const response = await fetch('https://auth-mern-1nvpq2abk-ujjwal-rajs-projects-a7446681.vercel.app/auth/change-username', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
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
    }

    const fetchProducts = async () => {
        try {
            const url = "https://auth-mern-1nvpq2abk-ujjwal-rajs-projects-a7446681.vercel.app/products";
            const response = await fetch(url, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            const result = await response.json();
            setProducts(result);
        } catch (err) {
            handleError(err);
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <div className="home-container">
            <h1>Welcome {loggedInUser}</h1>
            
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

                <div className="action-buttons">
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
            </div>

            <div className="products-list">
                <h2>Products</h2>
                {products && products?.map((item, index) => (
                    <div key={index} className="product-item">
                        <span>{item.name}: ₹{item.price}</span>
                    </div>
                ))}
            </div>

            <ToastContainer />
        </div>
    )
}

export default Home
