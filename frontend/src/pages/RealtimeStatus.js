import React, { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, RefreshCw, Crosshair } from "lucide-react";
import { useMap } from "react-map-gl";

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
    if (!userLocation) {
      console.log("User location not available yet");
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

    setNearbyLocations(sortedLocations); // We keep the state name for now
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
  const MapControls = () => {
    const { current: map } = useMap();

    const centerToUser = () => {
      if (userLocation) {
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
        style={{
          ...buttonStyle,
          position: "absolute",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#2196F3",
          padding: "12px", // Square button for icon
          minWidth: "unset", // Override minWidth for square button
        }}
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
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
          Location access is required for better experience
        </p>
        <button
          onClick={getUserLocation}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Grant Location Access
        </button>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        padding: "10px",
        boxSizing: "border-box",
        gap: "10px",
      }}
    >
      {/* Map Container */}
      <div
        style={{
          height: "50vh", // Fixed height for map container
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <Map
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          initialViewState={{
            longitude: userLocation?.longitude || MOCK_USER_LOCATION.longitude,
            latitude: userLocation?.latitude || MOCK_USER_LOCATION.latitude,
            zoom: 15,
          }}
          style={{ width: "100%", height: "100%" }} // Fill container
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          {locationDenied && <LocationAccessButton />}
          <Marker
            longitude={userLocation.longitude}
            latitude={userLocation.latitude}
          >
            <MapPin color="#2196F3" size={24} />
          </Marker>

          {locations.map((location) => (
            <Marker
              key={location.id}
              longitude={location.longitude}
              latitude={location.latitude}
              onClick={() => setSelectedLocation(location)}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: getMarkerColor(location.status),
                  cursor: "pointer",
                  border: "2px solid white",
                }}
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
              <div style={{ padding: "8px", minWidth: "200px" }}>
                <h3 style={{ fontWeight: "bold", marginBottom: "8px" }}>
                  {selectedLocation.name}
                </h3>
                <p style={{ marginBottom: "4px" }}>
                  Status: {selectedLocation.status}
                </p>
                <p>
                  Occupancy: {selectedLocation.currentOccupancy}/
                  {selectedLocation.capacity}
                </p>
              </div>
            </Popup>
          )}

          <MapControls />
        </Map>
      </div>

      {/* Control Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 15px",
          gap: "10px",
          height: "48px", // Fixed height for buttons
        }}
      >
        <button
          onClick={isTourActive ? handleEndTour : handleStartTour}
          style={{
            ...buttonStyle,
            backgroundColor: isTourActive ? "#f44336" : "#4CAF50",
          }}
        >
          {isTourActive ? "End Tour" : "Start Tour"}
        </button>
        <button
          onClick={sortLocationsByDistance}
          style={{
            ...buttonStyle,
            backgroundColor: "#2196F3",
            padding: "12px", // Square button for icon
            minWidth: "unset", // Override minWidth for square button
          }}
        >
          <RefreshCw size={24} color="white" />
        </button>
      </div>

      {/* Locations List */}
      <div
        style={{
          padding: "15px",
          backgroundColor: "#f5f5f5",
          border: "1px solid #ccc",
          borderRadius: "8px",
          overflowY: "auto",
          flex: 1, // Take remaining space
          minHeight: "200px", // Minimum height even when empty
          maxHeight: "calc(40vh)", // Maximum height to prevent overflow
        }}
      >
        <h2 style={{ marginBottom: "20px", fontSize: "1.2em" }}>
          Nearby Locations
        </h2>
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            gap: "10px",
            height: "40px", // Fixed height for search container
          }}
        >
          <input
            type="text"
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              flex: 1,
              height: "100%", // Match container height
              boxSizing: "border-box", // Include padding in height calculation
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              height: "100%", // Match container height
              boxSizing: "border-box", // Include padding in height calculation
            }}
          >
            <option value="all">All Status</option>
            <option value="empty">Empty</option>
            <option value="inline">In Line</option>
            <option value="ongoing">Ongoing</option>
          </select>
        </div>
        {filteredLocations.map((location) => (
          <div
            key={location.id}
            style={{
              backgroundColor: "white",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div>
                <h3 style={{ marginBottom: "4px", fontSize: "1em" }}>
                  {location.name}
                </h3>
                <p style={{ marginBottom: "2px", fontSize: "0.8em" }}>
                  Distance: {Math.round(location.distance)}m
                </p>
                <p style={{ fontSize: "0.8em" }}>
                  Occupancy: {location.currentOccupancy}/{location.capacity}
                </p>
              </div>
              {isTourActive && (
                <button
                  onClick={() => handleStatusChange(location.id)}
                  style={{
                    ...buttonStyle,
                    backgroundColor: getMarkerColor(location.status),
                    margin: "0",
                  }}
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

      {/* Responsive Styles */}
      <style>
        {`
                @media (max-width: 768px) {
                    .container {
                        padding: 10px;
                    }
                }
            `}
      </style>
    </div>
  );
};

export default RealtimeStatus;
