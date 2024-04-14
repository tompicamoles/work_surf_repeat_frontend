import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const url = "https://api.airtable.com/v0/appEifpsElq8TYpAy/spots";
const token =process.env.REACT_APP_AIRTABLE_API_KEY
   // Replace with your actual API key

export const createSpot = createAsyncThunk(
  "spots/createSpot",
  async (spotData) => {
    const { name, country, level, surfSeason, wifiQuality, hasCoworking, hasColiving, lifeCost } = spotData;
    
    const generateImage = async (name) => {
      // Generate image URL based on name and country
      const query = ` ${name}  surfing `;
      const url = `https://api.unsplash.com/photos/random?query=${query}`;
      const token = process.env.REACT_APP_UNSPLASH_TOKEN;

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: token,
            Params: {
              query: "surf",
            },
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
            country: country,
            level: level,
            image: image,
            surf_season: surfSeason,
            wifi_quality:parseInt(wifiQuality),
            has_coworking: hasCoworking,
            has_coliving: hasColiving,
            life_cost: parseInt(lifeCost),
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
    const spot = json.records[0];

    // get spot ID and Create new spot object in the current slice
    const newSpot = {
      id: spot.id,
      name: spot.fields.name,
      country: spot.fields.country,
      level: spot.fields.level,
      image: spot.fields.image,
      surfSeason: spot.fields.surf_season,
      wifiQuality: spot.fields.wifi_quality,
      hasCoworking: spot.fields.has_coworking,
      hasColiving: spot.fields.has_coliving,
      lifeCost: spot.fields.life_cost
    };

    return newSpot
  }

);

export const loadSpots = createAsyncThunk("spots/loadSpots", async () => {
  const getUrl = `${url}?maxRecords=12&view=Grid%20view`;

  const response = await fetch(getUrl, {
    headers: {
      Authorization: token,
    },
  });
  const json = await response.json();
  console.log(json);

  const cardsData = json.records.reduce((spots, record) => {
    console.log("spot before:", spots);
    spots[record.id] = {
      id: record.id,
      name: record.fields.name,
      country: record.fields.country,
      level: record.fields.level,
      image: record.fields.image,
      surfSeason: record.fields.surf_season,
      wifiQuality: record.fields.wifi_quality,
      hasCoworking: record.fields.has_coworking,
      hasColiving: record.fields.has_coliving,
      lifeCost: record.fields.life_cost

    };
    console.log("spots after", spots);
    return spots;
  }, {});

  return cardsData;
});

export const spotsSlice = createSlice({
  name: "spots",
  initialState: {
    spots: {},
    isLoadingSpots: false,
    failedToLoadSpots: false,
    isLoadingSpotCreation: false,
    failedToCreateSpot: false,
  },
  reducers: {
    updateSpot: (state, action) => {
      console.log("spot updated");
    },

    deleteSpot: (state, action) => {
      console.log("spot deleted");
    },

    likeSpot: (state, action) => {
      console.log("spot liked");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadSpots.pending, (state) => {
        state.isLoadingSpots = true;
        state.failedToLoadSpots = false;
      })
      .addCase(loadSpots.rejected, (state) => {
        state.isLoadingSpots = false;
        state.failedToLoadSpots = true;
      })
      .addCase(loadSpots.fulfilled, (state, action) => {
        state.isLoadingSpots = false;
        state.failedToLoadSpots = false;
        state.spots = action.payload;
        console.log("spots", action.payload);
      })
      .addCase(createSpot.pending, (state) => {
        state.isLoadingSpotCreation = true;
        state.failedToCreateSpot = false;
      })
      .addCase(createSpot.rejected, (state) => {
        state.isLoadingSpotCreation = false;
        state.failedToCreateSpot = true;
      })
      .addCase(createSpot.fulfilled, (state, action) => {
        state.isLoadingSpotCreation = false;
        state.failedToCreateSpot = false;
        state.spots[action.payload.id] = action.payload;
        console.log("new spot created:", action.payload);
      });
  },
});

export const selectSpots = (state) => state.spots.spots;
export const failedToLoadSpots = (state) => state.spots.failedToLoadSpots;
export const isLoadingSpots = (state) => state.spots.isLoadingSpots;

export default spotsSlice.reducer;
