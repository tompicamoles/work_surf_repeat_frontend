import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const url = "https://api.airtable.com/v0/appEifpsElq8TYpAy/comments";

export const createComment = createAsyncThunk(
  "comments/createComment",
  async (commentData) => {
    const {
      content,
      destination_id,
      submitted_by,
      rating,
      date,
      creatorName,
    } = commentData;

    const data = {
      records: [
        {
          fields: {
            content: content,
            destination_id: destination_id,
            submitted_by: submitted_by,
            creator_name: creatorName,
            rating: parseInt(rating),
            date: date,
          },
        },
      ],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "XXX",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();
    const comment = json.records[0];

    // get spot ID and Create new spot object in the current slice
    const newComment = {
      id: comment.id,
      content: content,
      destination_id: destination_id,
      creatorName: creatorName,
      submittedBy: submitted_by,
      rating: rating,
      date: date,
    };

    return newComment;
  }
);

export const loadComments = createAsyncThunk(
  "comments/loadComments",
  async (id) => {
    const getUrl = `${url}?filterByFormula=%7Bdestination_id%7D%3D%22${id}%22&maxRecords=15`;

    const response = await fetch(getUrl, {
      headers: {
        Authorization: "XXX",
      },
    });

    const json = await response.json();

    const commentsData = json.records.reduce((comments, record) => {
      comments[record.id] = {
        id: record.id,
        content: record.fields.content,
        destinationId: record.fields.destination_id,
        submittedBy: record.fields.submitted_by,
        creatorName: record.fields.creator_name,
        rating: record.fields.rating,
        date: record.fields.date,
      };

      return comments;
    }, {});

    return commentsData;
  }
);

export const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    comments: {},
    isLoadingComments: false,
    failedToLoadComments: false,
    isLoadingCommentCreation: false,
    failedTocreateComment: true,
  },
  //   reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadComments.pending, (state) => {
        state.isLoadingComments = true;
        state.failedToLoadComments = false;
      })
      .addCase(loadComments.rejected, (state) => {
        state.isLoadingComments = false;
        state.failedToLoadComments = true;
      })
      .addCase(loadComments.fulfilled, (state, action) => {
        state.isLoadingComments = false;
        state.failedToLoadComments = false;
        state.comments = action.payload;
      })
      .addCase(createComment.pending, (state) => {
        state.isLoadingCommentCreation = true;
        state.failedTocreateComment = false;
      })
      .addCase(createComment.rejected, (state) => {
        state.isLoadingCommentCreation = false;
        state.failedTocreateComment = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isLoadingCommentCreation = false;
        state.failedTocreateComment = false;
        state.comments[action.payload.id] = action.payload;
      });
  },
});

export const selectComments = (state) => state.comments.comments;
export const failedToLoadComments = (state) =>
  state.comments.failedToLoadComments;
export const isLoadingComments = (state) => state.comments.isLoadingComments;

export default commentsSlice.reducer;
