import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please login again.');
      navigate('/login');
      return;
    }

    fetch(`${process.env.REACT_APP_API_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(user => {
        setCurrentUser(user);
      });

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        } else {
          const err = await res.json();
          alert(err.detail || 'Unauthorized');
          navigate('/login');
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error fetching users');
      });
  }, [navigate]);

  const handleActivate = async (userId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/activate/${userId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (res.ok) {
      alert('User activated');
      window.location.reload();
    } else {
      alert(data.detail || 'Activation failed');
    }
  };

  const handleDelete = async (userId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/delete/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (res.ok) {
      alert('User deleted');
      window.location.reload();
    } else {
      alert(data.detail || 'Deletion failed');
    }
  };

  const isAdmin = currentUser?.role === 'admin';
  const isSuperAdmin = currentUser?.role === 'superadmin';

  return (
    <div className="container">
      <h2>Dashboard</h2>
      {isSuperAdmin && <div><strong>Super Admin Access Area</strong></div>}
      <br />
      <label>All Users:</label><br />
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Active</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.full_name}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{user.is_active ? "✅" : "❌"}</td>
              {isAdmin && (
                <td>
                  {!user.is_active && (
                    <button onClick={() => handleActivate(user.id)}>Activate</button>
                  )}
                  {" "}
                  {user.username !== currentUser.username && (
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <button onClick={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
        navigate('/login');
      }}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
