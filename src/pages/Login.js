import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (!data.is_active) {
          alert("Your account is not yet activated. Please contact an admin.");
          return;
        }

        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user_role', data.role); // Save role for RBAC
        navigate('/dashboard');
      } else {
        alert(data.detail || 'Login failed');
      }
    } catch (error) {
      alert('Error logging in');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
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
      <button onClick={handleLogin}>Login</button>
      <br /><br />
      <button onClick={() => navigate('/')}>Back to Signup</button>
    </div>
  );
}

export default Login;
