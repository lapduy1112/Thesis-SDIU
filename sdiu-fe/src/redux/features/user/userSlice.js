import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "../../../configs/axiosConfig";

export const getAllUsers = createAsyncThunk(
  "users/getalluser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await Axios.get("/users/", data, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXIiOnsiaXNBZG1pbiI6ZmFsc2UsIl9pZCI6IjY1OTQyZTQxYTgxNDA1NjhmZTIyMjAwMSIsIm5hbWUiOiJOZ3V5ZW4gRHV5IExhcCIsImVtYWlsIjoibGFwZHV5MTExMjAxQGdtYWlsLmNvbSIsInN0dWRlbnRJZCI6Iml0aXRpdTE5MTUzIiwicGhvdG9VUkwiOlsiaHR0cHM6Ly9lNy5wbmdlZ2cuY29tL3BuZ2ltYWdlcy83MDUvMjI0L3BuZy1jbGlwYXJ0LXVzZXItY29tcHV0ZXItaWNvbnMtYXZhdGFyLW1pc2NlbGxhbmVvdXMtaGVyb2VzLnBuZyJdLCJub3RpZmljYXRpb25zIjpbXSwiY2FydCI6eyJ0b3RhbCI6MCwiY291bnQiOjB9LCJwb3N0cyI6W10sImNyZWF0ZWRBdCI6IjIwMjQtMDEtMDJUMTU6Mzk6NDUuMzY2WiIsInVwZGF0ZWRBdCI6IjIwMjQtMDEtMDJUMTU6NDU6NDguNzc5WiIsIl9fdiI6MH19LCJpYXQiOjE3MDQyNTgzMDAsImV4cCI6MTcwNDM0NDcwMH0.G9ol94yU3a5N9axdAvCp-Kuo2GEJ0U2rfAbR0ip_hmY `,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const initialState = {
  listusers: [],
  status: "idle",
  error: null,
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getAllUsers.pending, (state) => {
          state.status = "loading";
        })
        .addCase(getAllUsers.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.listusers = action.payload;
        })
        .addCase(getAllUsers.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload.message;
        });
    },
  });
  
  export default userSlice.reducer;
