import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuth, signOut } from "firebase/auth";

const initialState = {
  email: null,
  token: null,
  id: null,
  role: null,
  error: null,
};

export const login = createAsyncThunk(
  "login",
  async ({ email, password }, { rejectWithValue, getState }) => {
    try {
      const token = getState().user.token;
      const headers = {};
      if (token) {
        headers.authorization = `Bearer ${token}`;
      }

      console.log("login");
      const user = await axios.post(
        "http://localhost:5000/login",
        {
          email,
          password,
        },
        { headers }
      );
      console.log(user);
      return user.data;
    } catch (error) {
      console.log({ error });
      return rejectWithValue({ error: error.message });
    }
  }
);

export const logout = createAsyncThunk(
  "logout",
  async (_, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (error) {
      console.log(error);
      return rejectWithValue({ error: error.message });
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.id = action.payload.id;
      state.role = action.payload.role;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      console.log(action);
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.id = action.payload.uid;
      state.role = action.payload.role;
      state.error = null;
    });

    builder.addCase(logout.fulfilled, () => initialState);
    builder.addMatcher(
      (action) => action.type.endsWith("/rejected")
      // (state, action) => {
      //   console.log(action);
      //   state.error = action.payload.error;
      // }
    );
  },
});

// export const { setUser } = userSlice.actions;

export default userSlice.reducer;
