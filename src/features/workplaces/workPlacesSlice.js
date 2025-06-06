import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { uploadImage } from "../../tierApi/supabase";

const createWorkPlaceObject = (place) => {
  return {
    id: place.id,
    name: place.name,
    type: place.type,
    spotId: place.spot_id || place.destination_id,
    submittedBy: place.submitted_by,
    creatorName: place.creator_name,
    adress: place.adress,
    rating: place.rating,
    likes: place.likes
      ? typeof place.likes === "string"
        ? place.likes.split(",")
        : place.likes
      : [],
    image_link: place.image_link,
    longitude: parseFloat(place.longitude),
    latitude: parseFloat(place.latitude),
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
      googleId,
      longitude,
      latitude,
      selectedFile,
    } = workPlaceData;

    console.log("place rating from slice:", rating);

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
    console.log("workplace json is:", json);

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

export const workPlacesSlice = createSlice({
  name: "workPlaces",
  initialState: {
    workPlaces: {},
    isLoadingWorkPlaces: false,
    failedToLoadWorkPlaces: false,
    isLoadingWorkPlaceCreation: false,
    failedTocreateWorkPlace: true,
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
      });
  },
});

export const selectWorkPlaces = (state) => state.workPlaces.workPlaces;
export const failedToLoadWorkPlaces = (state) =>
  state.workPlaces.failedToLoadWorkPlaces;
export const isLoadingWorkPlaces = (state) =>
  state.workPlaces.isLoadingWorkPlaces;

export default workPlacesSlice.reducer;
