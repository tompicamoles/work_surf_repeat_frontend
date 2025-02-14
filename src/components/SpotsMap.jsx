"use client";

import { Map } from "@vis.gl/react-google-maps";

import { useSelector } from "react-redux";
import { selectSpots } from "./spotsSlice";
import { SpotMarker } from "./SpotsMarker";

export default function SpotsMap() {
  const spots = useSelector(selectSpots);
  const defaultCenter = { lat: 43.6667, lng: -1.4167 };
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Map
        defaultZoom={2}
        defaultCenter={defaultCenter}
        mapId={process.env.REACT_APP_MAP_API}
        disableDefaultUI
      >
        {Object.keys(spots).map((id) => (
          <SpotMarker key={id} {...spots[id]} />
        ))}
      </Map>
    </div>
  );
}
