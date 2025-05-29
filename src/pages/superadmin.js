// frontend/src/pages/Superadmin.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Superadmin = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const pendingUsers = response.data.filter(user => !user.is_active);
        setUsers(pendingUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error.response?.data || error.message);
      }
    };

    fetchUsers();
  }, [token]);

  const activateUser = async (username) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/admin/activate-user/${username}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.msg);
      setUsers(users.filter(user => user.username !== username));
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to activate user");
    }
  };

  return (
    <div>
      <h2>Pending User Activations</h2>
      {users.length === 0 ? (
        <p>No pending users.</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.username}>
              {user.full_name} ({user.role}) - {user.username}
              <button onClick={() => activateUser(user.username)}>Activate</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Superadmin;
