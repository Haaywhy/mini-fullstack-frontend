import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!fullName || !username || !password || !role) {
      alert("Full name, username, password, and role are required.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ full_name: fullName, username, password, role }),
      });

      if (response.ok) {
        alert('Signup successful! Please wait for admin approval before logging in.');
        navigate('/login');
      } else {
        const data = await response.json();
        console.error('Signup error:', data);
        if (Array.isArray(data.detail)) {
          const messages = data.detail.map(d => d.msg).join(', ');
          alert(`Signup error: ${messages}`);
        } else {
          alert(data.detail || 'Signup failed');
        }
      }
    } catch (error) {
      alert('Network error. Please try again.');
      console.error('Signup exception:', error);
    }
  };

  return (
    <div className="container">
      <h2>Signup</h2>
      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      /><br />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
        <option value="superadmin">Super Admin</option>
      </select><br /><br />
      <button onClick={handleSignup}>Sign Up</button>
      <br /><br />
      <button onClick={() => navigate('/login')}>Back to Login</button>
    </div>
  );
}

export default Signup;
