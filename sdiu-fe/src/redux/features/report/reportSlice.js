import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "../../../configs/axiosConfig";

export const addReport = createAsyncThunk(
  "report/add",
  async (data, { rejectWithValue }) => {
    try {
      const response = await Axios.post("/report", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  isLoading: false,
  errorMessage: "",
  isLoadingAdd: false,
  isLoadingDelete: false,
  report: {},
  reports: [],
};
const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    reset: () => initialState,
    setReports: (state, action) => {
        state.reports = action.payload;
      },
  },
  extraReducers:(builder)=>{
    builder.addCase(addReport.pending, (state, action) => {
        state.isLoading = true;
      });
  
      builder.addCase(addReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports.push(action.payload);
      });
  
      builder.addCase(addReport.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload.message;
      });
  }
});
export const { reset, setReports } = reportSlice.actions;
export default reportSlice.reducer;
