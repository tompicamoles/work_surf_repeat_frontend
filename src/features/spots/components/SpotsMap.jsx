import { Icon } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useSelector } from "react-redux";
import { selectSpots } from "../spotsSlice";
import SpotCard from "./SpotCard";

export const SpotMap = () => {
  const position = [43.6667, -1.4167]; // Coordonnées de Hossegor, France pour centrer la carte

  const surfIcon = new Icon({
    iconUrl: "/spot.png",
    iconSize: [38, 38],
  });

  const spots = useSelector(selectSpots);

  return (
    <MapContainer
      center={position}
      zoom={3}
      style={{ height: "50vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <MarkerClusterGroup chunkedLoading>
        {Object.keys(spots).map((id) => {
          const spotPosition = [spots[id].latitude, spots[id].longitude];
          return (
            <Marker position={spotPosition} icon={surfIcon}>
              <Popup>
                <div style={{ width: "230px" }}>
                  <SpotCard id={id} key={id} />
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
};
