import "./App.css";
import Root from "./Root.js";
import HomePage from "../pages/Homepage.jsx";
import Destinations from "../pages/Destination.jsx";
import { useDispatch } from "react-redux";
import { loadSpots } from "../features/spots/spotsSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser, checkAuth } from "../features/user/userSlice";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { useEffect } from "react";
import { Profile } from "../pages/Profile";

const appRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/destination/:id" element={<Destinations />} />
      <Route path=":search" element={<HomePage />} />
      <Route path="/profile" element={<Profile />} />



      {/*<Route path="/search" element={<SearchPage/>}/>
    
    <Route path="/login" element={<LogIn/>} />
    <Route path="/blog" element={<Blog/>} />
    <Route path="/error" element={<ErrorPage/>} /> */}
    </Route>
  )
);

export default function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);


  useEffect(() => {
    dispatch(loadSpots())
    dispatch(checkAuth());

  },[])

  console.log("currentUser", currentUser)

  return <RouterProvider router={appRouter} />;
}
