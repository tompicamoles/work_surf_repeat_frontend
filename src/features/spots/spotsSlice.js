import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { uploadImage } from "../../tierApi/supabase"; // Import the generic function

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
    submittedBy: spot.submitted_by,
    latitude: parseFloat(spot.latitude),
    longitude: parseFloat(spot.longitude),
    likeUserIds: spot.like_user_ids ?? [],
    totalLikes: spot.total_likes ?? 0,
    creatorName: spot.creator_name,
    summary: spot.summary,
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
      selectedFile,
    } = spotData;

    let image_link = null;

    if (selectedFile) {
      try {
        image_link = await uploadImage(selectedFile, "spot", name, country);
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }

    const data = {
      name,
      country,
      image_link, // This will be from Supabase or null
      wifi_quality: parseInt(wifiQuality),
      has_coworking: hasCoworking,
      has_coliving: hasColiving,
    };

    const token = getState().user.session?.access_token;

    console.log("posting spot now");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/spots`,
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
      console.log("the response is", response);

      const responseData = await response.json();

      if (!response.ok) {
        throw responseData;
      }

      const newSpot = createSpotObject(responseData);
      return newSpot;
    } catch (error) {
      console.error("Error creating spot:", error);
      throw error;
    }
  }
);

export const loadSpots = createAsyncThunk(
  "spots/loadSpots",
  async ({ filters = {}, page = 1, limit = 12 } = {}) => {
    const {
      lifeCost,
      hasColiving,
      hasCoworking,
      wifiQuality,
      country,
      surfSeason = [],
    } = filters || {};

    const queryParams = new URLSearchParams();

    // Pagination parameters
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    // Filter parameters
    if (lifeCost) queryParams.append("lifeCost", lifeCost);
    if (hasColiving) queryParams.append("hasColiving", hasColiving);
    if (hasCoworking) queryParams.append("hasCoworking", hasCoworking);
    if (wifiQuality) queryParams.append("wifiQuality", wifiQuality);
    if (country) queryParams.append("country", country);
    if (surfSeason && surfSeason.length) {
      surfSeason.forEach((season) => queryParams.append("surfSeason", season));
    }

    const queryString = queryParams.toString();
    const url = `${process.env.REACT_APP_BACKEND_API_URL}/spots?${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": process.env.REACT_APP_BACKEND_API_KEY,
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    // Assume backend returns { spots: [...], totalCount: number, hasMore: boolean }
    const spots = json.spots || json; // Fallback for current API structure
    const totalCount = json.totalCount || spots.length;
    const hasMore =
      json.hasMore !== undefined ? json.hasMore : spots.length === limit;

    const cardsData = spots.reduce((acc, spot) => {
      acc[spot.id] = createSpotObject(spot);
      return acc;
    }, {});

    return {
      spots: cardsData,
      page,
      hasMore,
      totalCount,
      isFirstLoad: page === 1,
    };
  }
);

export const loadMoreSpots = createAsyncThunk(
  "spots/loadMoreSpots",
  async (_, { getState }) => {
    const state = getState();
    const { currentPage, currentFilters, hasMore } = state.spots;

    console.log("📄 loadMoreSpots called with state:", {
      currentPage,
      hasMore,
    });

    // Prevent loading if no more data available
    if (!hasMore) {
      console.log("⏹️ loadMoreSpots blocked: no more data available");
      return { spots: {}, page: currentPage, hasMore: false, totalCount: 0 };
    }

    const nextPage = currentPage + 1;
    const limit = 12;

    console.log(`🔄 Loading page ${nextPage} with limit ${limit}`);

    // Make direct API call for next page
    const queryParams = new URLSearchParams();

    // Pagination parameters
    queryParams.append("page", nextPage.toString());
    queryParams.append("limit", limit.toString());

    // Apply current filters
    const {
      lifeCost,
      hasColiving,
      hasCoworking,
      wifiQuality,
      country,
      surfSeason = [],
    } = currentFilters || {};

    if (lifeCost) queryParams.append("lifeCost", lifeCost);
    if (hasColiving) queryParams.append("hasColiving", hasColiving);
    if (hasCoworking) queryParams.append("hasCoworking", hasCoworking);
    if (wifiQuality) queryParams.append("wifiQuality", wifiQuality);
    if (country) queryParams.append("country", country);
    if (surfSeason && surfSeason.length) {
      surfSeason.forEach((season) => queryParams.append("surfSeason", season));
    }

    const queryString = queryParams.toString();
    const url = `${process.env.REACT_APP_BACKEND_API_URL}/spots?${queryString}`;

    console.log("🌐 Making API request to:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": process.env.REACT_APP_BACKEND_API_KEY,
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    console.log("📬 loadMoreSpots API response:", json);

    // Handle response structure
    const spots = json.spots || json;
    const totalCount = json.totalCount || spots.length;
    const hasMoreSpots =
      json.hasMore !== undefined ? json.hasMore : spots.length === limit;

    const cardsData = spots.reduce((acc, spot) => {
      acc[spot.id] = createSpotObject(spot);
      return acc;
    }, {});

    console.log("✅ loadMoreSpots returning:", {
      spotsCount: Object.keys(cardsData).length,
      page: nextPage,
      hasMore: hasMoreSpots,
      totalCount,
    });

    return {
      spots: cardsData,
      page: nextPage,
      hasMore: hasMoreSpots,
      totalCount,
    };
  }
);

export const likeSpot = createAsyncThunk(
  "spots/likeSpot",
  async (spotId, { getState }) => {
    const token = getState().user.session?.access_token;
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_API_URL}/spots/${spotId}/like`,
      {
        method: "post",
        headers: {
          "x-api-key": process.env.REACT_APP_BACKEND_API_KEY,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
    // Pagination state
    currentPage: 0,
    hasMore: true,
    isLoadingMore: false,
    totalCount: 0,
    currentFilters: {},
  },
  reducers: {
    resetPagination: (state) => {
      state.currentPage = 0;
      state.hasMore = true;
      state.spots = {};
      state.totalCount = 0;
    },
    setCurrentFilters: (state, action) => {
      state.currentFilters = action.payload;
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

        const { spots, page, hasMore, totalCount, isFirstLoad } =
          action.payload;

        if (isFirstLoad) {
          // Replace spots for first load or new filters
          state.spots = spots;
        } else {
          // Append spots for pagination
          state.spots = { ...state.spots, ...spots };
        }

        state.currentPage = page;
        state.hasMore = hasMore;
        state.totalCount = totalCount;
      })
      .addCase(loadMoreSpots.pending, (state) => {
        state.isLoadingMore = true;
      })
      .addCase(loadMoreSpots.rejected, (state) => {
        state.isLoadingMore = false;
      })
      .addCase(loadMoreSpots.fulfilled, (state, action) => {
        state.isLoadingMore = false;

        const { spots, page, hasMore, totalCount } = action.payload;

        // Append new spots
        state.spots = { ...state.spots, ...spots };
        state.currentPage = page;
        state.hasMore = hasMore;
        state.totalCount = totalCount;
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
        state.totalCount += 1;
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
        if (spot) {
          if (status === 201) {
            // Liked
            spot.likeUserIds.push(userId);
            spot.totalLikes += 1;
          } else if (status === 200) {
            // Unliked
            spot.likeUserIds = spot.likeUserIds.filter((id) => id !== userId);
            spot.totalLikes -= 1;
          }
        }
      });
  },
});

export const { resetPagination, setCurrentFilters } = spotsSlice.actions;
export const selectSpots = (state) => state.spots.spots;
export const selectHasMore = (state) => state.spots.hasMore;
export const selectIsLoadingMore = (state) => state.spots.isLoadingMore;
export const selectCurrentPage = (state) => state.spots.currentPage;
export const selectTotalCount = (state) => state.spots.totalCount;
export const failedToLoadSpots = (state) => state.spots.failedToLoadSpots;
export const isLoadingSpots = (state) => state.spots.isLoadingSpots;

export default spotsSlice.reducer;
