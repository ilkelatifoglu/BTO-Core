import React, { useState, useEffect, useRef } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, RefreshCw, Crosshair } from "lucide-react";
import "./RealtimeStatus.css";

// Mock data
const MOCK_LOCATIONS = [
  {
    id: 1,
    name: "Library",
    latitude: 39.925533,
    longitude: 32.866287,
    capacity: 3,
    currentOccupancy: 1,
    status: "empty",
  },
  {
    id: 2,
    name: "B Building",
    latitude: 39.926533,
    longitude: 32.867287,
    capacity: 2,
    currentOccupancy: 2,
    status: "ongoing",
  },
  {
    id: 3,
    name: "Sports Hall",
    latitude: 39.924533,
    longitude: 32.865287,
    capacity: 4,
    currentOccupancy: 0,
    status: "empty",
  },
];

const MOCK_USER_LOCATION = {
  latitude: 39.925533,
  longitude: 32.866287,
};

const RealtimeStatus = () => {
  const [userLocation, setUserLocation] = useState(MOCK_USER_LOCATION);
  const [locations, setLocations] = useState(MOCK_LOCATIONS);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isTourActive, setIsTourActive] = useState(false);
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationDenied, setLocationDenied] = useState(false);

  const mapRef = useRef();

  // Get user location
  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationDenied(false);
        },
        (error) => {
          console.error("Location access denied:", error);
          setLocationDenied(true);
          setError("Location access denied");
        }
      );
    }
  };

  // Calculate distance between points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Update nearby locations
  const sortLocationsByDistance = () => {
    if (!userLocation || !locations) {
      console.log("User location or locations not available yet");
      return;
    }

    const sortedLocations = locations
      .map((location) => ({
        ...location,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          location.latitude,
          location.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    setNearbyLocations(sortedLocations);
  };

  // Initialize
  useEffect(() => {
    getUserLocation();
  }, []);

  // Update nearby locations when user location changes
  useEffect(() => {
    if (userLocation) {
      sortLocationsByDistance();
    }
  }, [userLocation]);

  const handleStartTour = () => {
    setIsTourActive(true);
    sortLocationsByDistance();
  };

  const handleEndTour = () => {
    setIsTourActive(false);
    setSelectedLocation(null);
    // Here you would save tour data to database
  };

  const handleStatusChange = (locationId) => {
    setLocations((prevLocations) =>
      prevLocations.map((location) => {
        if (location.id === locationId) {
          const statusMap = {
            empty: "inline",
            inline: "ongoing",
            ongoing: "empty",
          };
          return {
            ...location,
            status: statusMap[location.status],
            currentOccupancy:
              statusMap[location.status] === "ongoing"
                ? location.currentOccupancy + 1
                : location.currentOccupancy,
          };
        }
        return location;
      })
    );

    // Update nearbyLocations immediately after locations update
    setNearbyLocations((prevNearbyLocations) =>
      prevNearbyLocations.map((location) => {
        if (location.id === locationId) {
          const statusMap = {
            empty: "inline",
            inline: "ongoing",
            ongoing: "empty",
          };
          return {
            ...location,
            status: statusMap[location.status],
            currentOccupancy:
              statusMap[location.status] === "ongoing"
                ? location.currentOccupancy + 1
                : location.currentOccupancy,
          };
        }
        return location;
      })
    );
  };

  const getMarkerColor = (status) => {
    switch (status) {
      case "empty":
        return "#FF4444";
      case "inline":
        return "#FFBB33";
      case "ongoing":
        return "#00C851";
      default:
        return "#757575";
    }
  };

  // Add this button style object for reuse
  const buttonStyle = {
    padding: "12px 20px",
    fontSize: "16px",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    minWidth: "120px", // Ensure minimum width
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  };

  // Update the MapControls component
  const MapControls = ({ mapRef }) => {
    const centerToUser = () => {
      const map = mapRef.current;
      if (map && userLocation) {
        map.flyTo({
          center: [userLocation.longitude, userLocation.latitude],
          zoom: 15,
          duration: 1000,
        });
      }
    };

    return (
      <button
        onClick={centerToUser}
        className="realtime-status__button realtime-status__button--icon realtime-status__button--crosshair"
      >
        <Crosshair size={24} color="white" />
      </button>
    );
  };

  // Filter locations
  const filteredLocations = nearbyLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" || location.status === statusFilter)
  );

  const LocationAccessButton = () => {
    return (
      <div className="realtime-status__location-access">
        <p className="realtime-status__location-access-text">
          Location access is required for better experience
        </p>
        <button
          onClick={getUserLocation}
          className="realtime-status__location-access-button"
        >
          Grant Location Access
        </button>
      </div>
    );
  };

  return (
    <div className="realtime-status">
      <div className="realtime-status__map-container">
        <Map
          ref={mapRef}
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          initialViewState={{
            longitude: userLocation?.longitude || MOCK_USER_LOCATION.longitude,
            latitude: userLocation?.latitude || MOCK_USER_LOCATION.latitude,
            zoom: 15,
          }}
          className="realtime-status__map"
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          {locationDenied && <LocationAccessButton />}
          {userLocation && (
            <Marker
              longitude={userLocation.longitude}
              latitude={userLocation.latitude}
            >
              <MapPin color="#2196F3" size={24} />
            </Marker>
          )}

          {locations.map((location) => (
            <Marker
              key={location.id}
              longitude={location.longitude}
              latitude={location.latitude}
              onClick={() => setSelectedLocation(location)}
            >
              <div
                className={`realtime-status__marker realtime-status__marker--${location.status}`}
              />
            </Marker>
          ))}

          {selectedLocation && (
            <Popup
              longitude={selectedLocation.longitude}
              latitude={selectedLocation.latitude}
              anchor="bottom"
              offset={[0, -20]}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setSelectedLocation(null)}
            >
              <div className="realtime-status__popup">
                <h3 className="realtime-status__popup-title">
                  {selectedLocation.name}
                </h3>
                <p className="realtime-status__popup-text">
                  Status: {selectedLocation.status}
                </p>
                <p className="realtime-status__popup-text">
                  Occupancy: {selectedLocation.currentOccupancy}/
                  {selectedLocation.capacity}
                </p>
              </div>
            </Popup>
          )}

          <MapControls mapRef={mapRef} />
        </Map>
      </div>

      <div className="realtime-status__controls">
        <button
          onClick={isTourActive ? handleEndTour : handleStartTour}
          className={`realtime-status__button ${
            isTourActive
              ? "realtime-status__button--end"
              : "realtime-status__button--start"
          }`}
        >
          {isTourActive ? "End Tour" : "Start Tour"}
        </button>
        <button
          onClick={sortLocationsByDistance}
          className="realtime-status__button realtime-status__button--icon realtime-status__button--refresh"
        >
          <RefreshCw size={24} color="white" />
        </button>
      </div>

      <div className="realtime-status__locations-list">
        <h2 className="realtime-status__list-title">Nearby Locations</h2>
        <div className="realtime-status__search-container">
          <input
            type="text"
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="realtime-status__search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="realtime-status__status-select"
          >
            <option value="all">All Status</option>
            <option value="empty">Empty</option>
            <option value="inline">In Line</option>
            <option value="ongoing">Ongoing</option>
          </select>
        </div>
        {filteredLocations.map((location) => (
          <div key={location.id} className="realtime-status__location-card">
            <div className="realtime-status__location-content">
              <div className="realtime-status__location-info">
                <h3 className="realtime-status__location-name">
                  {location.name}
                </h3>
                <p className="realtime-status__location-distance">
                  Distance: {Math.round(location.distance)}m
                </p>
                <p className="realtime-status__location-occupancy">
                  Occupancy: {location.currentOccupancy}/{location.capacity}
                </p>
              </div>
              {isTourActive && (
                <button
                  onClick={() => handleStatusChange(location.id)}
                  className={`realtime-status__button realtime-status__marker--${location.status}`}
                >
                  {location.status === "empty"
                    ? "Empty"
                    : location.status === "inline"
                    ? "In Line"
                    : "Ongoing"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealtimeStatus;
