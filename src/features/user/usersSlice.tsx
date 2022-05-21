import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

// Define a type for the slice state
interface UsersSlice {
  isLoggedIn: boolean,
  email: string,
}

// Define the initial state using that type
const initialState: UsersSlice = {
  isLoggedIn: false,
  email: "",
};

export const usersSlice = createSlice({
  name: "users",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setLogin: (state, action: PayloadAction<any>) => {
      state.isLoggedIn = true;
      state.email = action.payload;
    },
    setLogout: (state) => {
      state.isLoggedIn = false;
      state.email = "";
    },
  },
});

export const { setLogin, setLogout } = usersSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.counter.value;

export default usersSlice.reducer;