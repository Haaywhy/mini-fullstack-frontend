import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        alert('Signup successful! Please log in.');
        navigate('/login');
      } else {
        const data = await response.json();
        alert(data.detail || 'Signup failed');
      }
    } catch (error) {
      alert('Error signing up');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Signup</h2>
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
      <button onClick={handleSignup}>Sign Up</button>
      <br /><br />
      <button onClick={() => navigate('/login')}>Back to Login</button>
    </div>
  );
}

export default Signup;
