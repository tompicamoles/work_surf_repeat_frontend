import { configureStore } from "@reduxjs/toolkit";
import spotsReducer from "../features/spots/spotsSlice";
import workPlacesReducer from "../features/workplaces/workPlacesSlice";
import commentsReducer from "../features/comments/commentsSlice";
import userReducer from "../features/user/userSlice";

export default configureStore({
    reducer: {
    spots: spotsReducer,
    workPlaces: workPlacesReducer,
    comments: commentsReducer,
    user: userReducer,
    },
});