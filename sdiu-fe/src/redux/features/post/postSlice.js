import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "../../../configs/axiosConfig";
const accessToken = localStorage.getItem("authToken");

export const addPost = createAsyncThunk(
  "news/add",
  async (data, { rejectWithValue }) => {
    try {
      const response = await Axios.post("/posts", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPost = createAsyncThunk(
  "post/getOne",
  async (post_id, { rejectWithValue }) => {
    try {
      const { data } = await Axios.get(`/post/${post_id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getAllPost = createAsyncThunk(
  "post/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await Axios.get("/posts");
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deletePost = createAsyncThunk(
  "post/delete",
  async (post_id, thunkAPI) => {
    try {
      const response = await Axios.delete(`/posts/delete/${post_id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const commentPost = createAsyncThunk(
  "post/comment",
  async ({ post_id, data }, thunkAPI) => {
    try {
      const response = await Axios.post(`/posts/comment/${post_id}`,data,{
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  isLoading: false,
  errorMessage: "",
  isLoadingAdd: false,
  isLoadingDelete: false,
  post: {},
  posts: [],
  comments: [],
};
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addPost.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(addPost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts.push(action.payload);
    });

    builder.addCase(addPost.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });

    builder.addCase(getAllPost.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getAllPost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts = action.payload.data;
    });

    builder.addCase(getAllPost.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
    builder.addCase(deletePost.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(deletePost.fulfilled, (state, action) => {
      console.log(state);
      state.isLoading = false;
      state.posts = state.posts.filter(
        (post) => post._id !== action.payload._id
      );
    });
    builder.addCase(deletePost.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
    builder.addCase(getPost.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getPost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.post = action.payload.data;
    });

    builder.addCase(getPost.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
    // builder.addCase(commentPost.fulfilled, (state, action) => {
    //   state.isLoadingAdd = false;
    //   //   state.post.reviews.push(action.payload);
    //   state.comments.push(action.payload);
    // });

    // builder.addCase(commentPost.rejected, (state, action) => {
    //   state.isLoadingAdd = false;
    //   state.errorMessage = action.payload.message;
    // });

    // builder.addCase(commentPost.pending, (state, action) => {
    //   state.isLoadingAdd = true;
    // });
  },
});

export const { reset, setPosts } = postSlice.actions;

export default postSlice.reducer;
