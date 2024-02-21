import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "../../../configs/axiosConfig";
const accessAdminToken = localStorage.getItem("authAdminToken");
export const addNews = createAsyncThunk(
  "news/add",
  async (data, { rejectWithValue }) => {
    try {
      const response = await Axios.post("/news/addnews", data,{
        headers: { Authorization: `Bearer ${localStorage.getItem("authAdminToken")} `}
      })
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getNews = createAsyncThunk(
  "news/getOne",
  async (news_id, { rejectWithValue }) => {
    try {
      const { data } = await Axios.get(`/news/${news_id}`,
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getAllNews = createAsyncThunk(
  "news/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await Axios.get("/news",
      {
        headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXIiOnsiaXNBZG1pbiI6ZmFsc2UsIl9pZCI6IjY1OTQyZTQxYTgxNDA1NjhmZTIyMjAwMSIsIm5hbWUiOiJOZ3V5ZW4gRHV5IExhcCIsImVtYWlsIjoibGFwZHV5MTExMjAxQGdtYWlsLmNvbSIsInN0dWRlbnRJZCI6Iml0aXRpdTE5MTUzIiwicGhvdG9VUkwiOlsiaHR0cHM6Ly9lNy5wbmdlZ2cuY29tL3BuZ2ltYWdlcy83MDUvMjI0L3BuZy1jbGlwYXJ0LXVzZXItY29tcHV0ZXItaWNvbnMtYXZhdGFyLW1pc2NlbGxhbmVvdXMtaGVyb2VzLnBuZyJdLCJub3RpZmljYXRpb25zIjpbXSwiY2FydCI6eyJ0b3RhbCI6MCwiY291bnQiOjB9LCJwb3N0cyI6W10sImNyZWF0ZWRBdCI6IjIwMjQtMDEtMDJUMTU6Mzk6NDUuMzY2WiIsInVwZGF0ZWRBdCI6IjIwMjQtMDEtMDJUMTU6NDU6NDguNzc5WiIsIl9fdiI6MH19LCJpYXQiOjE3MDQyNTgzMDAsImV4cCI6MTcwNDM0NDcwMH0.G9ol94yU3a5N9axdAvCp-Kuo2GEJ0U2rfAbR0ip_hmY `}
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteNews = createAsyncThunk(
  "news/delete",
  async (news_id, thunkAPI) => {
    try {
      const response = await Axios.delete(`/news/delete/${news_id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
const initialState = {
  listnews: [],
  status: "idle",
  error: null,
  news:{}
};
const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    reset: () => initialState,
    setNews: (state, action) => {
      state.news = action.payload;
    },
  },
  extraReducers: (build) => {
    build.addCase(addNews.pending, (state, action) => {
      state.status = "loading";
    });

    build.addCase(addNews.fulfilled, (state, action) => {
      state.status = "succeeded";
    });

    build.addCase(addNews.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });

    build.addCase(getAllNews.pending, (state, action) => {
      state.status = "loading";
    });

    build.addCase(getAllNews.fulfilled, (state, action) => {
      state.status = "succeed";
      state.listnews = action.payload.data;
    });

    build.addCase(getAllNews.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.message;
    });
    build.addCase(deleteNews.pending, (state, action) => {
      state.status = "loading";
    });

    build.addCase(deleteNews.fulfilled, (state, action) => {
      state.status = "succeed";
      state.listnews = state.listnews.filter(
        (news) => news._id !== action.payload._id
      );
    });
    build.addCase(deleteNews.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.message;
    });
    build.addCase(getNews.pending, (state, action) => {
      state.status = "loading";
    });

    build.addCase(getNews.fulfilled, (state, action) => {
      state.status = "succeed";
      state.news = action.payload.data;
    });

    build.addCase(getNews.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.message;
    });
  },
});
export const { reset, setProducts } = newsSlice.actions;

export default newsSlice.reducer;
