import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const url = "https://api.airtable.com/v0/appEifpsElq8TYpAy/work_places";
const token = process.env.REACT_APP_AIRTABLE_API_KEY;

export const createWorkPlace = createAsyncThunk(
  "workPlaces/createWorkPlace",
  async (workPlaceData) => {
    const {
      name,
      type,
      destination_id,
      submited_by,
      creatorNickname,
      adress,
      rating,
      likes,
      googleId,
      longitude,
      latitude,
    } = workPlaceData;

    const generateImage = async (name) => {
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

    const image = await generateImage(name); //
    const data = {
      records: [
        {
          fields: {
            name: name,
            type: type,
            destination_id: destination_id,
            image: image,
            submited_by: submited_by,
            creator_nickname: creatorNickname,
            adress: adress,
            rating: rating,
            likes: likes.toString(),
            google_id: googleId,
            longitude: longitude.toString(),
            latitude: latitude.toString(),
          },
        },
      ],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();
    const place = json.records[0];

    // get spot ID and Create new spot object in the current slice
    const newWorkPlace = {
      id: place.id,
      name: name,
      type: type,
      destination_id: destination_id,
      image: image,
      submitedBy: submited_by,
      creatorNickname : creatorNickname,
      adress: adress,
      rating: rating,
      likes: likes,
      googleid: googleId,
      longitude: longitude,
      latitude: latitude,
    };

    return newWorkPlace;
  }
);

export const loadWorkPlaces = createAsyncThunk(
  "workPlaces/loadWorkPlaces",
  async (id) => {
    const getUrl = `${url}?filterByFormula=%7Bdestination_id%7D%3D%22${id}%22&maxRecords=15`;

    const response = await fetch(getUrl, {
      headers: {
        Authorization: token,
      },
    });

    const json = await response.json();
    console.log(json);

    const workPlacesData = json.records.reduce(
      (workPlaces, record) => {
        const type = record.fields.type;

        const workPlace = {
          id: record.id,
          name: record.fields.name,
          type: record.fields.type,
          destinationId: record.fields.destination_id,
          submitedBy: record.fields.submited_by,
          creatorNickname: record.fields.creator_nickname,
          adress: record.fields.adress,
          rating: record.fields.rating,
          likes: record.fields.likes.split(","),
          image: record.fields.image,
          googleId: record.fields.google_id,
          longitude: parseFloat(record.fields.longitude),
          latitude: parseFloat(record.fields.latitude)
        };

        if (type === "coworking") {
          workPlaces.coworking[record.id] = workPlace;
        } else if (type === "café") {
          workPlaces.café[record.id] = workPlace;
        } else if (type === "coliving") {
          workPlaces.coliving[record.id] = workPlace;
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
