"use client";

import { Map } from "@vis.gl/react-google-maps";

import { useSelector } from "react-redux";
import { selectSpots } from "./spotsSlice";
import { selectWorkPlaces } from "./workPlacesSlice";
import { WorkPlaceMarker } from "./WorkPlaceMarker";

export default function WorkPlacesMap({ id }) {
  const workPlaces = useSelector(selectWorkPlaces);
  const spot = useSelector(selectSpots)[id];
  const spotPosition = { lat: spot.latitude, lng: spot.longitude };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Map
        defaultZoom={15}
        defaultCenter={spotPosition}
        mapId={process.env.REACT_APP_MAP_API}
        disableDefaultUI
      >
        {Object.keys(workPlaces).map((category) =>
          Object.keys(workPlaces[category]).map((id) => (
            <WorkPlaceMarker key={id} {...workPlaces[category][id]} />
          ))
        )}
      </Map>
    </div>
  );
}
