import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  email: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  department: "",
  yearOfStudy: "",
  licenceId: null,
  encodedImage: null,
  verified: false,
};

const slice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.id = action.payload.id || "";
      state.email = action.payload.email || "";
      state.firstName = action.payload.firstName || action.payload.first_name || "";
      state.lastName = action.payload.lastName || action.payload.last_name || "";
      state.phoneNumber = action.payload.phoneNumber || action.payload.phone_number || "";
      state.department = action.payload.department || "";
      state.yearOfStudy = action.payload.yearOfStudy || action.payload.year_of_study || "";
      state.licenceId = action.payload.licenceId || action.payload.licence_id || null;
      state.encodedImage = action.payload.encodedImage || action.payload.encoded_image || null;
      state.verified = action.payload.verified || false;
    },
  },
});

const initialidState = {
  idSelected: 1,
};

const selectedIdSlice = createSlice({
  name: "selectedid",
  initialState: initialidState,
  reducers: {
    setIdselected: (state, action) => {
      state.idSelected = action.payload;
    },
  },
});

const initialRideState = {
  rides: [],
};

const rideDataSlice = createSlice({
  name: "ridedatafromstore",
  initialState: initialRideState,
  reducers: {
    setRides: (state, action) => {
      state.rides = action.payload;
    },
  },
});

const initialLoginState = {
  isLoggedIn: false,
}

const loginSlice = createSlice({
  name: "logindata",
  initialState: initialLoginState,
  reducers: {
    setIsLogin: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setLogout: (state, action) => {
      state.isLoggedIn = action.payload;
    }
  }
})

export const { setIdselected } = selectedIdSlice.actions;
export const { setLogin } = slice.actions;
export const { setRides } = rideDataSlice.actions;
export const { setIsLogin, setLogout } = loginSlice.actions;

export default {
  Loginslice: slice.reducer,
  selectedIdslice: selectedIdSlice.reducer,
  rideDataSlice: rideDataSlice.reducer,
  IsLoginSlice: loginSlice.reducer,
};
