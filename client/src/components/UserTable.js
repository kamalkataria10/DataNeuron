import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserRow from "./UserRow";
import { deleteUser, updateUser } from "../userSlice";

const UserTable = ({ users }) => {
  const dispatch = useDispatch();
  const [localError, setLocalError] = useState("");

  // Get the error from the Redux store
  const error = useSelector((state) => state.users.error);

  useEffect(() => {
    // Reset local error when Redux error changes
    setLocalError("");
  }, [error]);

  const handleDelete = (userId) => {
    dispatch(deleteUser(userId)).catch((error) => {
      // Handle errors here
      setLocalError(error.message || "Delete failed. Please try again.");
    });
  };

  const handleUpdate = (updatedUser) => {
    dispatch(updateUser(updatedUser))
      .then(() => {
        // Code to handle success
        console.log("Update successful");
      })
      .catch((error) => {
        // Code to handle error
        console.error("Error during user update:", error);
        setLocalError(error.message || "Update failed. Please try again.");
      });
  };

  return (
    <div>
      {localError && <p style={{ color: "red" }}>{localError}</p>}
      {error && typeof error === "string" && (
        <p style={{ color: "red" }}>{error}</p>
      )}
      <h2>User Table</h2>
      <table border="1" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Full Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow
              key={user._id}
              user={user}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              localError={localError}
              setLocalError={setLocalError}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
