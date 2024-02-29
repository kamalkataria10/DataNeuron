import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUsers, fetchApiCounts } from "./userSlice";
import { Base_URL } from "./components/Server";

export const registerUser = createAsyncThunk(
  "registration/registerUser",
  async (formData, thunkAPI) => {
    try {
      const response = await fetch(`${Base_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      thunkAPI.dispatch(fetchUsers());
      thunkAPI.dispatch(fetchApiCounts());
      return data.data;
    } catch (error) {
      throw error;
    }
  }
);

const registrationSlice = createSlice({
  name: "registration",
  initialState: {
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default registrationSlice.reducer;
