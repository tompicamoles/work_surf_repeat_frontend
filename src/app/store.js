import { configureStore } from "@reduxjs/toolkit";
import spotsReducer from "../components/spotsSlice";
import workPlacesReducer from "../components/workPlacesSlice";
import commentsReducer from "../components/commentsSlice"
import userReducer from "../components/userSlice"

export default configureStore({
    reducer: {
    spots: spotsReducer,
    workPlaces : workPlacesReducer,
    comments: commentsReducer,
    user: userReducer,
    },
  });