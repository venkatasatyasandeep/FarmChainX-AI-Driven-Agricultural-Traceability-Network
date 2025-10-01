import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API, logoutUser } from "./api"; 
import "../styles/admin.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [showPasswordIds, setShowPasswordIds] = useState([]);
  const navigate = useNavigate();

  const roles = ["farmer", "distributor", "retailer", "customer"];

  useEffect(() => {
    const fetchUsers = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || storedUser.role.toLowerCase() !== "admin") {
        alert("Access denied. Admins only.");
        logoutUser();
        navigate("/login");
        return;
      }

      try {
        const response = await API.get("/all-with-passwords");
        setUsers(response.data);
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const handleDelete = async (userId) => {
    const user = users.find(u => u.id === userId);
    if (user.role.toLowerCase() === "admin") return alert("Admin cannot be deleted");

    if (!window.confirm("Are you sure?")) return;

    try {
      await API.delete(`/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete user.");
    }
  };

  const startEditingRole = (userId, currentRole) => {
    const user = users.find(u => u.id === userId);
    if (user.role.toLowerCase() === "admin") return alert("Admin role cannot be changed");
    setEditingRoleId(userId);
    setNewRole(currentRole);
  };

  const saveRole = async (userId) => {
    try {
      await API.put(`/${userId}/role`, { role: newRole });
      setUsers(users.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
      setEditingRoleId(null);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update role.");
    }
  };

  const togglePassword = (id) => {
    setShowPasswordIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <button className="btn-logout" onClick={handleLogout}>Logout</button>


      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password (hashed)</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan="7">No users found.</td></tr>
          ) : (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {showPasswordIds.includes(user.id) ? user.password : "••••••••"}
                  <span
                    style={{ marginLeft: "5px", cursor: "pointer" }}
                    onClick={() => togglePassword(user.id)}
                  >
                    {showPasswordIds.includes(user.id) ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </td>
                <td>
                  {editingRoleId === user.id ? (
                    <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                      {roles.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td>
                  {editingRoleId === user.id ? (
                    <button onClick={() => saveRole(user.id)}>Save</button>
                  ) : (
                    <>
                      <button onClick={() => startEditingRole(user.id, user.role)} disabled={user.role.toLowerCase() === "admin"}>Edit</button>
                      <button onClick={() => handleDelete(user.id)} disabled={user.role.toLowerCase() === "admin"}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
