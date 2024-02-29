import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../regSlice";

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const registrationStatus = useSelector((state) => state.registration.status);
  const registrationError = useSelector((state) => state.registration.error);

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    username: "",
  });

  useEffect(() => {
    if (registrationStatus === "succeeded") {
      setFormData({
        email: "",
        fullName: "",
        username: "",
      });
    }
  }, [registrationStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      dispatch(registerUser(formData));
      // Registration status will be updated in the next render cycle, so it may not be immediately available here.
    } catch (error) {
      console.error("Error during user registration:", error);
      // Handle the error as needed, for example, display an error message to the user.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {registrationStatus === "failed" && (
        <p style={{ color: "red" }}>{registrationError}</p>
      )}
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Full Name:</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          style={{
            width: "30%",
            margin: "auto",
            marginTop: "20px",
            marginBottom: "8px",
          }}
        >
          Register
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;
