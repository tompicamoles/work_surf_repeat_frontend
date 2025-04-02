import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const createWorkPlaceObject = (place) => {
  return {
    id: place.id,
    name: place.name,
    type: place.type,
    spotId: place.spot_id || place.destination_id,
    submittedBy: place.submitted_by,
    creatorName: place.creator_name,
    adress: place.adress,
    rating: parseInt(place.rating),
    likes: place.likes ? (typeof place.likes === 'string' ? place.likes.split(",") : place.likes) : [],
    image_link: place.image_link,
    googleId: place.google_id,
    longitude: parseFloat(place.longitude),
    latitude: parseFloat(place.latitude)
  };
};

export const createWorkPlace = createAsyncThunk(
  "workPlaces/createWorkPlace",
  async (workPlaceData) => {
    const {
      name,
      type,
      spotId,
      adress,
      rating,
      googleId,
      longitude,
      latitude,
    } = workPlaceData;

    const generateImage = async () => {
      // Generate image URL based on name and country
      const query = ` café`;
      const url = `https://api.unsplash.com/photos/random?query=${query}`;
      const token = process.env.REACT_APP_UNSPLASH_TOKEN;

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: token,
            Params: {},
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }

        const data = await response.json();
        const imgUrl = data.urls.regular;
        return imgUrl;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // You can handle or propagate the error as needed
      }
    };

    const image_link = await generateImage(name);

    const data = {
      name: name,
      type: type,
      spot_id: parseInt(spotId),
      image_link,
      adress: adress,
      rating: parseInt(rating),
      google_id: googleId,
      longitude: longitude,
      latitude: latitude,
    };

    const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/workplaces`, {
      method: "POST",
      headers: {
        "x-api-key": process.env.REACT_APP_BACKEND_API_KEY,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown error occurred" }));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    const place = await response.json();
    return createWorkPlaceObject(place);
  }
);

export const loadWorkPlaces = createAsyncThunk(
  "workPlaces/loadWorkPlaces",
  async (spotId) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/spots/${spotId}/workplaces`, {
      method: "GET",
      headers: {
        "x-api-key": process.env.REACT_APP_BACKEND_API_KEY,
        "Content-Type": "application/json",
      },
    });

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
