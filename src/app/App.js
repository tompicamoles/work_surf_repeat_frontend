import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { loadSpots } from "../features/spots/spotsSlice";
import { checkAuth, setSession } from "../features/user/userSlice";
import Destinations from "../pages/Destination.jsx";
import HomePage from "../pages/Homepage.jsx";
import { Profile } from "../pages/Profile";
import { supabase } from "../tierApi/supabase";
import "./App.css";
import Root from "./Root.js";

const appRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/destination/:id" element={<Destinations />} />
      <Route path=":search" element={<HomePage />} />
      <Route path="/profile" element={<Profile />} />
    </Route>
  )
);

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load first page of spots without filters on app initialization
    dispatch(loadSpots());
    dispatch(checkAuth());

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return <RouterProvider router={appRouter} />;
}
