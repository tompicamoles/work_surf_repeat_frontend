import { configureStore } from "@reduxjs/toolkit";
import spotsReducer from "../components/spotsSlice";
import workPlacesReducer from "../components/workPlacesSlice";
import commentsReducer from "../components/commentsSlice"

export default configureStore({
    reducer: {
    spots: spotsReducer,
    workPlaces : workPlacesReducer,
    comments: commentsReducer
    },
  });