import { configureStore } from '@reduxjs/toolkit';
import styleReducer from './styleSlice';
import mainReducer from './mainSlice';
import authSlice from './authSlice';

import usersSlice from "./users/usersSlice";
import campaignsSlice from "./campaigns/campaignsSlice";
import eventsSlice from "./events/eventsSlice";
import feedbacksSlice from "./feedbacks/feedbacksSlice";
import initiativesSlice from "./initiatives/initiativesSlice";
import leadersSlice from "./leaders/leadersSlice";
import newsSlice from "./news/newsSlice";

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,

users: usersSlice,
campaigns: campaignsSlice,
events: eventsSlice,
feedbacks: feedbacksSlice,
initiatives: initiativesSlice,
leaders: leadersSlice,
news: newsSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
