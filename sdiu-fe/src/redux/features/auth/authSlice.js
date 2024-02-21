import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "../../../configs/axiosConfig";
import { jwtDecode } from "jwt-decode";

export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await Axios.post("/auth/signup", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { rejectWithValue }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    try {
      const { data } = await Axios.get("/checkauth/getLogged", config);
       setTimeout(function () {

       }, 5000);
      return data;
    } catch (error) {
      localStorage.removeItem("authToken");
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyAdminToken = createAsyncThunk(
  "auth/verifyAdminToken",
  async (_, { rejectWithValue }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authAdminToken")}`,
      },
    };
    try {
      const { data } = await Axios.get("/checkauth/getLoggedAdmin", config);
      setTimeout(function () {}, 2000);
      return data;
    } catch (error) {
      localStorage.removeItem("authAdminToken");
      return rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await Axios.post("/auth/login", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const logout = createAsyncThunk(
  "auth/logout",
  async (data, { rejectWithValue }) => {
    try {
      const response = await Axios.delete("/auth/logout", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  isLoading: true,
  isLoadingToken: true,
  isSuccess: {},
  errorMessage: "",
  isLogin: false,
  loggedUser: {},
  loggedAdmin: {},
  isAdminLogin: false,
};
const authSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    reset: () => initialState,
    clearError(state, action) {
      state.error = null;
      // state.status = "idle";
    },
    setLoggedUser: (state, action) => {
      state.loggedUser = action.payload;
      state.isLoading = false;
      state.isLogin = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(register.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.isLoading = false;
    });
    builder.addCase(register.pending, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.message;
    });
    builder.addCase(verifyToken.fulfilled, (state, action) => {
      state.isLoading = false;
      state.loggedUser = action.payload;
      state.isLogin = true;
    });

    builder.addCase(verifyToken.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(verifyToken.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload.message || null;
    });
    builder.addCase(verifyAdminToken.fulfilled, (state, action) => {
      state.isLoadingToken = false;
      state.loggedAdmin = action.payload;
      state.isAdminLogin = true;
    });

    builder.addCase(verifyAdminToken.pending, (state, action) => {
      state.isLoadingToken = true;
    });

    builder.addCase(verifyAdminToken.rejected, (state, action) => {
      state.isLoadingToken = false;
      state.error = action.payload.message || null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.isLoading = false;
      const { data } = action.payload;
      const decoded = jwtDecode(data.accessToken);
      state.auth = {
        accessToken: data.accessToken,
        refeshToken: data.refeshToken,
      };
    });
    builder.addCase(login.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.message;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.isLoading = false;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });
  },
});

// Selector
// export const selectAccessAuth = (state) => state.auth;
// export const selectAuthErrorState = (state) => state.auth.auth;

export const { clearError, successLogin, successLogOut,setLoggedUser } = authSlice.actions;

export default authSlice.reducer;
