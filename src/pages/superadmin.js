import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Superadmin() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => {
        console.error(err);
        alert("Failed to fetch users.");
        navigate('/login');
      });
  }, [navigate]);

  const handleActivate = async (userId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/activate/${userId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      alert('User activated successfully.');
      // Refresh the list
      setUsers(users.map(user => user.id === userId ? { ...user, is_active: true } : user));
    } else {
      alert(data.detail || 'Activation failed.');
    }
  };

  return (
    <div>
      <h2>Superadmin Dashboard</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Username</th>
            <th>Roles</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.full_name}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{user.is_active ? '✅ Active' : '❌ Inactive'}</td>
              <td>
                {!user.is_active && (
                  <button onClick={() => handleActivate(user.id)}>Activate</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      <button onClick={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
      }}>
        Logout
      </button>
    </div>
  );
}

export default Superadmin;
