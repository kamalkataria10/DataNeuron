import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const UserRow = ({ user, onDelete, onUpdate, localError, setLocalError }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const userStatus = useSelector((state) => state.users.status);
  console.log(userStatus);
  useEffect(() => {
    setUpdatedUser({ ...user });
  }, [user]);

  useEffect(() => {
    if (localError) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setLocalError("");
    }
  }, [localError, setLocalError]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (localError) {
        return;
      }
      await onUpdate(updatedUser);
      setIsEditing(false); // Set isEditing to false only on successful update
    } catch (error) {
      console.log(error);
      // Handle error if needed
      setIsEditing(true); // Set isEditing to true on error
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdatedUser({ ...user });
  };

  const handleDelete = () => {
    try {
      onDelete(user._id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <tr key={user._id}>
      <td>
        {isEditing ? (
          <input
            type="text"
            name="username"
            value={updatedUser.username}
            onChange={handleChange}
          />
        ) : (
          user.username
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            name="email"
            value={updatedUser.email}
            onChange={handleChange}
          />
        ) : (
          user.email
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            name="fullName"
            value={updatedUser.fullName}
            onChange={handleChange}
          />
        ) : (
          user.fullName
        )}
      </td>
      <td>
        {isEditing ? (
          <>
            <button onClick={handleSave} disabled={!!localError}>
              Save
            </button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </>
        )}
      </td>
    </tr>
  );
};

export default UserRow;
