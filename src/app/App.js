import "./App.css";
import Root from "./Root.js";
import HomePage from "../pages/Homepage.jsx";
import Destinations from "../pages/Destination.jsx";
import { useDispatch } from "react-redux";
import { loadSpots } from "../features/spots/spotsSlice";
import {
  checkAuth,
  setSession
} from "../features/user/userSlice";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { useEffect } from "react";
import { Profile } from "../pages/Profile";
import { supabase } from "../tierApi/supabase";
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

    dispatch(loadSpots())
    dispatch(checkAuth());

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session))
    })
    return () => subscription.unsubscribe()
  }, [dispatch])




  return <RouterProvider router={appRouter} />;
}
