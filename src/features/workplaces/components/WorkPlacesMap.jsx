import { Icon } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useSelector } from "react-redux";
import { selectSpots } from "../../spots/spotsSlice";
import { selectWorkPlaces } from "../workPlacesSlice";

export default function WorkPlacesMap({ id }) {
  const workPlaces = useSelector(selectWorkPlaces);
  const spot = useSelector(selectSpots)[id];
  const spotPosition = [spot.latitude, spot.longitude];

  const surfIcon = new Icon({
    iconUrl: "/spot.png",
    iconSize: [38, 38],
  });

  return (
    <MapContainer
      center={spotPosition}
      zoom={14}
      style={{ height: "50vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <MarkerClusterGroup>
        {Object.keys(workPlaces).map((category) =>
          Object.keys(workPlaces[category]).map((id) => {
            const workPlace = workPlaces[category][id];
            const workPlacePosition = [workPlace.latitude, workPlace.longitude];
            return (
              <Marker icon={surfIcon} position={workPlacePosition} key={id}>
                <Popup>{workPlace.name}</Popup>
              </Marker>
            );
          })
        )}
      </MarkerClusterGroup>
    </MapContainer>
  );

  // return (
  //   <div style={{ height: "100vh", width: "100%" }}>
  //     <Map
  //       defaultZoom={15}
  //       defaultCenter={spotPosition}
  //       mapId={process.env.REACT_APP_MAP_API}
  //       disableDefaultUI
  //     >
  //       {Object.keys(workPlaces).map((category) =>
  //         Object.keys(workPlaces[category]).map((id) => (
  //           <WorkPlaceMarker key={id} {...workPlaces[category][id]} />
  //         ))
  //       )}
  //     </Map>
  //   </div>
  // );
}
