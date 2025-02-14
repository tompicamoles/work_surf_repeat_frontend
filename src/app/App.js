import "./App.css";
import Root from "./Root";
import HomePage from "../pages/Homepage";
import  Destinations  from "../pages/Destination";
import { useDispatch } from "react-redux";
import { loadSpots } from "../components/spotsSlice";

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
       <Route path="/profile" element={<Profile/>} />



    {/*<Route path="/search" element={<SearchPage/>}/>
    
    <Route path="/login" element={<LogIn/>} />
    <Route path="/blog" element={<Blog/>} />
    <Route path="/error" element={<ErrorPage/>} /> */}
    </Route>
  )
);

export default function App() {
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(loadSpots())
  })

  return <RouterProvider router={appRouter} />;
}
