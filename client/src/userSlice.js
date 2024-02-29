import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Base_URL } from "./components/Server";
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch(`${Base_URL}/users/allusers`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Error fetching users");
  }
  return data.data;
});

export const fetchApiCounts = createAsyncThunk(
  "users/fetchApiCounts",
  async () => {
    const response = await fetch(`${Base_URL}/users/getcounts`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Error fetching API counts");
    }
    return data.data;
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (updatedUser, thunkAPI) => {
    try {
      const response = await fetch(
        `${Base_URL}/users/updateprofile/${updatedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error updating user");
      }

      thunkAPI.dispatch(fetchApiCounts());

      return updatedUser;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId) => {
    const response = await fetch(`${Base_URL}/users/delete/${userId}`, {
      method: "DELETE",
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Error deleting user");
    }
    return userId;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    status: "idle",
    error: null,
    apiCounts: { addApiCount: 0, updateApiCount: 0 },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.list = state.list.map((user) =>
          user._id === action.payload._id
            ? { ...user, ...action.payload }
            : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((user) => user._id !== action.payload);
      })
      .addCase(fetchApiCounts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.apiCounts = action.payload;
      })
      .addCase(fetchApiCounts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;
