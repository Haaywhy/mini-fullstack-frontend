// frontend/src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = new URLSearchParams();
    data.append("username", username);
    data.append("password", password);

    try {
      // Step 1: Get token
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/token`, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token } = response.data;
      localStorage.setItem("token", access_token);

      // Step 2: Fetch user details with token
      const userResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const user = userResponse.data;
      localStorage.setItem("role", user.role);

      if (!user.is_active) {
        setError("Account not activated. Contact an admin.");
        return;
      }

      // Step 3: Redirect based on role
      if (user.role === "superadmin") {
        navigate("/superadmin");
      } else if (user.role === "admin") {
        navigate("/admin"); // Optional: create this page later
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error(err);
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
