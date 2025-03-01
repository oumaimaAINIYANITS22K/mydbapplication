import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ name: '', age: '', job_title: '', email: '', experience: '' });

    // Fetch users from the backend
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Add a new user
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/add-user', formData);
            setFormData({ name: '', age: '', job_title: '', email: '', experience: '' }); // Clear form
            fetchUsers(); // Refresh user list
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    // Delete a user
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/delete-user/${id}`);
            fetchUsers(); // Refresh user list
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3 text-center">IT Job Management App</h2>

            {/* User Input Form */}
            <form onSubmit={handleSubmit} className="mb-4">
                <input className="form-control mb-2" type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                <input className="form-control mb-2" type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
                <input className="form-control mb-2" type="text" name="job_title" placeholder="Job Title" value={formData.job_title} onChange={handleChange} required />
                <input className="form-control mb-2" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input className="form-control mb-2" type="number" name="experience" placeholder="Years of Experience" value={formData.experience} onChange={handleChange} required />
                <button className="btn btn-primary w-100" type="submit">Add IT Professional</button>
            </form>

            {/* User List */}
            <h3>List of IT Professionals</h3>
            <ul className="list-group">
                {users.map(user => (
                    <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {user.name} (Age: {user.age}, Job: {user.job_title}, Exp: {user.experience} years, Email: {user.email})
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
