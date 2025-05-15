import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);

    if (!token) {
      alert('No token found. Please login again.');
      navigate('/login');
      return;
    }

    fetch("https://mini-fullstack-backend-1.onrender.com/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched data:", data);

          // Fix: Make sure to access `data.users`
          if (Array.isArray(data.users)) {
            setUsers(data.users.map(u => ({ id: u.id, username: u.username })));
          } else {
            throw new Error("Invalid response format");
          }
        } else {
          const err = await res.json();
          alert(err.detail || 'Unauthorized, please login again');
          navigate('/login');
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        alert('An error occurred. Please try again.');
      });
  }, [navigate]);

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <label>All Users:</label><br />
      <select>
        {users.map((user) => (
          <option key={user.id}>{user.username}</option>
        ))}
      </select>
      <br /><br />
      <button onClick={() => {
        localStorage.removeItem('token');
        navigate('/login');
      }}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
