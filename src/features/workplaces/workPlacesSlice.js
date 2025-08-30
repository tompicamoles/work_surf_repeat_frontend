import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { uploadImage } from "../../tierApi/supabase";

const createWorkPlaceObject = (place) => {
  return {
    id: place.id,
    name: place.name,
    type: place.type,
    spotId: place.spot_id,
    submittedBy: place.submitted_by,
    creatorName: place.creator_name,
    adress: place.adress,
    image_link: place.image_link,
    longitude: parseFloat(place.longitude),
    latitude: parseFloat(place.latitude),
    totalRatings: parseInt(place.total_ratings),
    averageRating: parseFloat(place.average_rating),
    ratings: place.ratings || [],
  };
};

export const createWorkPlace = createAsyncThunk(
  "workPlaces/createWorkPlace",
  async (workPlaceData, { getState }) => {
    const {
      name,
      type,
      spotId,
      adress,
      rating,
      comment,
      googleId,
      longitude,
      latitude,
      selectedFile,
    } = workPlaceData;

    let image_link = null;

    // Handle user uploaded image
    if (selectedFile) {
      try {
        image_link = await uploadImage(selectedFile, "workplace", name, type);
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }

    const data = {
      id: googleId,
      name: name,
      type: type,
      spot_id: parseInt(spotId),
      image_link,
      adress: adress,
      rating: rating,
      comment: comment,
      longitude: longitude,
      latitude: latitude,
    };

    // Get token from state instead of using useSelector
    const token = getState().user.session?.access_token;

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_API_URL}/workplaces`,
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.REACT_APP_BACKEND_API_KEY,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error occurred" }));
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    const newWorkPlace = createWorkPlaceObject(responseData);
    return newWorkPlace;
  }
);

export const loadWorkPlaces = createAsyncThunk(
  "workPlaces/loadWorkPlaces",
  async (spotId) => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_API_URL}/spots/${spotId}/workplaces`,
      {
        method: "GET",
        headers: {
          "x-api-key": process.env.REACT_APP_BACKEND_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const json = await response.json();

    const workPlacesData = json.reduce(
      (workPlaces, place) => {
        const type = place.type;
        const workPlace = createWorkPlaceObject(place);

        if (type === "coworking") {
          workPlaces.coworking[place.id] = workPlace;
        } else if (type === "café") {
          workPlaces.café[place.id] = workPlace;
        } else if (type === "coliving") {
          workPlaces.coliving[place.id] = workPlace;
        }

        return workPlaces;
      },
      { coworking: {}, café: {}, coliving: {} }
    );

    return workPlacesData;
  }
);

export const submitWorkPlaceRating = createAsyncThunk(
  "workPlaces/submitWorkPlaceRating",
  async (ratingData, { getState }) => {
    const {
      type,
      workPlaceId,
      rating,
      comment,
      isEditMode = false,
    } = ratingData;

    const data = {
      type: type,
      work_place_id: workPlaceId,
      rating: rating,
      comment: comment,
    };

    // Get token from state
    const token = getState().user.session?.access_token;

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_API_URL}/workplaces/${workPlaceId}/ratings`,
      {
        method: isEditMode ? "PUT" : "POST", // Use PUT for updates, POST for creates
        headers: {
          "x-api-key": process.env.REACT_APP_BACKEND_API_KEY,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error occurred" }));
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    const responseData = await response.json();
    return { type, workPlaceId, rating: responseData, isEditMode };
  }
);

export const workPlacesSlice = createSlice({
  name: "workPlaces",
  initialState: {
    workPlaces: {},
    isLoadingWorkPlaces: false,
    failedToLoadWorkPlaces: false,
    isLoadingWorkPlaceCreation: false,
    failedTocreateWorkPlace: true,
    isLoadingRatingSubmission: false,
    failedToSubmitRating: false,
  },
  //   reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadWorkPlaces.pending, (state) => {
        state.isLoadingWorkPlaces = true;
        state.failedToLoadWorkPlaces = false;
      })
      .addCase(loadWorkPlaces.rejected, (state) => {
        state.isLoadingWorkPlaces = false;
        state.failedToLoadWorkPlaces = true;
      })
      .addCase(loadWorkPlaces.fulfilled, (state, action) => {
        state.isLoadingWorkPlaces = false;
        state.failedToLoadWorkPlaces = false;
        state.workPlaces = action.payload;
        console.log("workPlaces", action.payload);
      })
      .addCase(createWorkPlace.pending, (state) => {
        state.isLoadingWorkPlaceCreation = true;
        state.failedTocreateWorkPlace = false;
      })
      .addCase(createWorkPlace.rejected, (state) => {
        state.isLoadingWorkPlaceCreation = false;
        state.failedTocreateWorkPlace = true;
      })
      .addCase(createWorkPlace.fulfilled, (state, action) => {
        state.isLoadingWorkPlaceCreation = false;
        state.failedTocreateWorkPlace = false;
        state.workPlaces[action.payload.type][action.payload.id] =
          action.payload;
        console.log("new spot created:", action.payload);
      })
      .addCase(submitWorkPlaceRating.pending, (state) => {
        state.isLoadingRatingSubmission = true;
        state.failedToSubmitRating = false;
      })
      .addCase(submitWorkPlaceRating.rejected, (state) => {
        state.isLoadingRatingSubmission = false;
        state.failedToSubmitRating = true;
      })
      .addCase(submitWorkPlaceRating.fulfilled, (state, action) => {
        state.isLoadingRatingSubmission = false;
        state.failedToSubmitRating = false;
        const { type, workPlaceId, rating, isEditMode } = action.payload;

        // Handle both create and update cases
        const ratingIndex = isEditMode
          ? state.workPlaces[type][workPlaceId].ratings.findIndex(
              (r) => r.user_id === rating.user_id
            )
          : -1;

        if (ratingIndex !== -1) {
          // Update existing rating
          state.workPlaces[type][workPlaceId].ratings[ratingIndex] = rating;
        } else {
          // Add new rating (either creating new or existing not found)
          state.workPlaces[type][workPlaceId].ratings.push(rating);
        }

        // Recalculate totals and average
        const ratings = state.workPlaces[type][workPlaceId].ratings;
        state.workPlaces[type][workPlaceId].totalRatings = ratings.length;

        const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
        state.workPlaces[type][workPlaceId].averageRating =
          ratings.length > 0 ? sum / ratings.length : 0;
      });
  },
});

export const selectWorkPlaces = (state) => state.workPlaces.workPlaces;

export const selectWorkPlacesArrayByType = createSelector(
  [selectWorkPlaces, (state, type) => type],
  (workPlaces, type) => {
    return Object.entries(workPlaces?.[type] || {})
      .map(([_id, workplace]) => workplace)
      .sort((a, b) => b.averageRating - a.averageRating);
  }
);

// Selector for getting a specific workplace by type and id
export const selectWorkPlaceById = createSelector(
  [selectWorkPlaces, (state, type) => type, (state, type, id) => id],
  (workPlaces, type, id) => {
    return workPlaces?.[type]?.[id] || null;
  }
);

// Selector for getting all workplaces in a safe format for mapping
export const selectAllWorkPlacesForMap = createSelector(
  [selectWorkPlaces],
  (workPlaces) => {
    const categories = ["café", "coworking", "coliving"];
    return categories.reduce((acc, category) => {
      acc[category] = workPlaces?.[category] || {};
      return acc;
    }, {});
  }
);
export const failedToLoadWorkPlaces = (state) =>
  state.workPlaces.failedToLoadWorkPlaces;
export const isLoadingWorkPlaces = (state) =>
  state.workPlaces.isLoadingWorkPlaces;

export default workPlacesSlice.reducer;
