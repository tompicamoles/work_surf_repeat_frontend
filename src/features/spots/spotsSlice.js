import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { generateImage } from "../../tierApi/unsplash";
import { getGeolocation } from "../../tierApi/googleMapsApi";
import { uploadSpotImage } from "../../tierApi/supabase"; // Import the new function

const createSpotObject = (spot) => {
  return {
    id: spot.id,
    name: spot.name,
    country: spot.country,
    image_link: spot.image_link,
    surfSeason: spot.surf_season.split(","),
    wifiQuality: spot.wifi_quality,
    hasCoworking: spot.has_coworking,
    hasColiving: spot.has_coliving,
    lifeCost: spot.life_cost,
    submittedBy: parseInt(spot.submitted_by),
    latitude: parseFloat(spot.latitude),
    longitude: parseFloat(spot.longitude),
    likeUserIds: spot.like_user_ids ?? [],
    totalLikes: spot.total_likes ?? 0,
    creatorName: spot.creator_name
  };
};

export const createSpot = createAsyncThunk(
  "spots/createSpot",
  async (spotData, { getState }) => {
    const {
      name,
      country,
      wifiQuality,
      hasCoworking,
      hasColiving,
      selectedFile, // selectedFile is now expected in spotData
    } = spotData;

    let image_link = null;

    if (selectedFile) {
      console.log("createSpot: selectedFile found, attempting to upload:", selectedFile.name);
      try {
        image_link = await uploadSpotImage(selectedFile);
        if (image_link) {
          console.log("createSpot: Image successfully uploaded to Supabase. URL:", image_link);
        } else {
          // This case handles if uploadSpotImage returns null (e.g. due to an internal error or failed URL retrieval)
          console.log("createSpot: Supabase upload returned null. Falling back to Unsplash.");
        }
      } catch (uploadError) {
        // This case handles if uploadSpotImage throws an error
        console.error("createSpot: Error during Supabase image upload. Falling back to Unsplash.", uploadError);
        // image_link remains null, will be handled by the next block
      }
    }

    // Fallback to Unsplash if no file was selected, or if Supabase upload failed (image_link is still null)
    if (!image_link) {
      console.log("createSpot: Generating image using Unsplash for", name, ",", country);
      try {
        image_link = await generateImage(name, country);
        console.log("createSpot: Unsplash image generated. URL:", image_link);
      } catch (unsplashError) {
        console.error("createSpot: Error generating image with Unsplash.", unsplashError);
        // image_link will remain null if Unsplash also fails. The backend should handle this.
      }
    }

    const geolocation = await getGeolocation(name, country);
    const latitude = geolocation.latitude;
    const longitude = geolocation.longitude;

    const data = {
      name,
      country,
      image_link, // This will be from Supabase, Unsplash, or null
      wifi_quality: parseInt(wifiQuality),
      has_coworking: hasCoworking,
      has_coliving: hasColiving,
      latitude,
      longitude,
    };

    const token = getState().user.session?.access_token;

    const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/spots`, {
      method: "POST",
      headers: {
        "x-api-key": process.env.REACT_APP_BACKEND_API_KEY,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    const spot = await response.json();
    const newSpot = createSpotObject(spot);
    return newSpot;
  }
);

export const loadSpots = createAsyncThunk(
  "spots/loadSpots",
  async (filters = {}) => {
    const {
      lifeCost,
      hasColiving,
      hasCoworking,
      wifiQuality,
      country,
      surfSeason = []
    } = filters || {};

    const queryParams = new URLSearchParams();
    if (lifeCost) queryParams.append('lifeCost', lifeCost);
    if (hasColiving) queryParams.append('hasColiving', hasColiving);
    if (hasCoworking) queryParams.append('hasCoworking', hasCoworking);
    if (wifiQuality) queryParams.append('wifiQuality', wifiQuality);
    if (country) queryParams.append('country', country);
    if (surfSeason && surfSeason.length) {
      surfSeason.forEach(season => queryParams.append('surfSeason', season));
    }

    const queryString = queryParams.toString();
    const url = `${process.env.REACT_APP_BACKEND_API_URL}/spots${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": process.env.REACT_APP_BACKEND_API_KEY,
        "Content-Type": "application/json",
      }
    });

    const json = await response.json();
    const cardsData = json.reduce((spots, spot) => {
      spots[spot.id] = createSpotObject(spot);
      return spots;
    }, {});
    return cardsData;
  }
);

export const likeSpot = createAsyncThunk(
  "spots/likeSpot",
  async (spotId, { getState }) => {
    const token = getState().user.session?.access_token;
    const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/spots/${spotId}/like`, {
      method: "post",
      headers: {
        "x-api-key": process.env.REACT_APP_BACKEND_API_KEY,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    const json = await response.json();
    const status = response.status;
    const userId = json.userId;
    return { json, status, spotId, userId };
  }
);

export const spotsSlice = createSlice({
  name: "spots",
  initialState: {
    spots: {},
    isLoadingSpots: false,
    failedToLoadSpots: false,
    isLoadingSpotCreation: false,
    failedToCreateSpot: false,
    isLoadingLikeSpot: false,
    failedToLikeSpot: false,
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
      })
      .addCase(likeSpot.pending, (state) => {
        state.isLoadingLikeSpot = true;
        state.failedToLikeSpot = false;
      })
      .addCase(likeSpot.rejected, (state) => {
        state.isLoadingLikeSpot = false;
        state.failedToLikeSpot = true;
      })
      .addCase(likeSpot.fulfilled, (state, action) => {
        state.isLoadingLikeSpot = false;
        state.failedToLikeSpot = false;
        const { spotId, status, userId } = action.payload;
        const spot = state.spots[spotId];
        if (spot) { // Ensure spot exists before trying to modify it
          if (status === 201) {
            spot.likeUserIds.push(userId);
          } else {
            spot.likeUserIds = spot.likeUserIds.filter(id => id !== userId);
          }
          spot.totalLikes = spot.likeUserIds.length;
        }
      });
  },
});

export const selectSpots = (state) => state.spots.spots;
export const failedToLoadSpots = (state) => state.spots.failedToLoadSpots;
export const isLoadingSpots = (state) => state.spots.isLoadingSpots;

export default spotsSlice.reducer;
