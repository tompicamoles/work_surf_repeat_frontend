import { configureStore } from "@reduxjs/toolkit";
import spotsReducer from "../features/spots/spotsSlice";
import userReducer from "../features/user/userSlice";
import workPlacesReducer from "../features/workplaces/workPlacesSlice";

export default configureStore({
  reducer: {
    spots: spotsReducer,
    workPlaces: workPlacesReducer,
    user: userReducer,
  },
});
