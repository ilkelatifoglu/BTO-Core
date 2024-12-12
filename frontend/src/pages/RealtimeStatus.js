import React, { useState, useEffect, useRef } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, RefreshCw, Crosshair } from "lucide-react";
import "./RealtimeStatus.css";
import { Toast } from "primereact/toast";

const RealtimeStatus = () => {
  const MOCK_USER_LOCATION = {
    latitude: 39.868201,
    longitude: 32.749127,
  };

  const [userLocation, setUserLocation] = useState(MOCK_USER_LOCATION);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isTourActive, setIsTourActive] = useState(false);
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationDenied, setLocationDenied] = useState(false);

  const mapRef = useRef();
  const toast = useRef(null);

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
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Location access granted!",
            life: 3000,
          });
        },
        (error) => {
          console.error("Location access denied:", error);
          setLocationDenied(true);
          setError("Location access denied");
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Location access denied. Some features may be limited.",
            life: 3000,
          });
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

  // Add new function to fetch locations
  const fetchLocations = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/tour-locations/`
      );
      // Log the response details for debugging
      console.log("Response status:", response.status);
      console.log("Response URL:", response.url);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Server response:", errorData);
        throw new Error(
          `Failed to fetch locations: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Fetched locations data:", data);
      console.log(
        "Status values:",
        data.map((loc) => ({ id: loc.id, status: loc.status }))
      );
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", {
        message: error.message,
        url: `${process.env.REACT_APP_BACKEND_URL}/tour-locations/`,
        env: process.env.REACT_APP_BACKEND_URL
          ? "Backend URL exists"
          : "Backend URL missing",
      });
      setError(`Failed to fetch locations: ${error.message}`);
    }
  };

  // Update handleStatusChange to include userId
  const handleStatusChange = async (locationId) => {
    try {
      const currentLocation = locations.find((loc) => loc.id === locationId);
      const userId = localStorage.getItem("userId");

      // Check if the user is already in this location
      const isUserInLocation = currentLocation.current_users?.some(
        (user) => user.user_id === userId
      );

      let endpoint;
      if (isUserInLocation) {
        // If user is in this location, they can leave
        endpoint = `${process.env.REACT_APP_BACKEND_URL}/tour-locations/end-tour`;
      } else {
        // If user is not in this location, they can enter if it's not full
        if (currentLocation.current_occupancy >= currentLocation.capacity) {
          throw new Error("Location is at full capacity");
        }
        endpoint = `${process.env.REACT_APP_BACKEND_URL}/tour-locations/start-tour`;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locationId, userId }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      await fetchLocations();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: isUserInLocation
          ? "Successfully left the location"
          : "Successfully entered the location",
        life: 3000,
      });
    } catch (error) {
      console.error("Error updating location status:", error);
      setError(error.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    }
  };

  // Update initialization useEffect
  useEffect(() => {
    getUserLocation();
    fetchLocations();
  }, []);

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

  // Add refresh handler
  const handleRefresh = async () => {
    await fetchLocations();
    sortLocationsByDistance();
  };

  // Update getMarkerColor function
  const getMarkerColor = (status) => {
    switch (status) {
      case "empty":
        return "#00C851"; // Green for empty
      case "partial":
        return "#FFBB33"; // Yellow for partially occupied
      case "full":
        return "#FF4444"; // Red for full
      default:
        return "#00C851"; // Default to green
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
      <Toast ref={toast} />
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
                className={`realtime-status__marker realtime-status__marker--${
                  location.status || "empty"
                }`}
                style={{
                  backgroundColor: getMarkerColor(location.status),
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  border: "2px solid white", // Add white border for contrast
                  boxShadow: "0 0 4px rgba(0,0,0,0.5)", // Add shadow for better visibility
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
              <div className="realtime-status__popup">
                <h3 className="realtime-status__popup-title">
                  {selectedLocation.name}
                </h3>
                <p className="realtime-status__popup-text">
                  Status: {selectedLocation.status}
                </p>
                <p className="realtime-status__popup-text">
                  Occupancy: {selectedLocation.current_occupancy}/
                  {selectedLocation.capacity}
                </p>

                {/* Add users list */}
                {selectedLocation.current_users &&
                  selectedLocation.current_users.length > 0 && (
                    <div className="realtime-status__popup-users">
                      <h4 className="realtime-status__popup-subtitle">
                        Current Visitors:
                      </h4>
                      <ul className="realtime-status__popup-users-list">
                        {selectedLocation.current_users.map((user, index) => (
                          <li
                            key={user.user_id}
                            className="realtime-status__popup-user"
                          >
                            <span className="realtime-status__popup-user-id">
                              User {index + 1}
                            </span>
                            <span className="realtime-status__popup-user-time">
                              {new Date(user.joined_at).toLocaleTimeString()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
          onClick={handleRefresh}
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
                  Occupancy: {location.current_occupancy}/{location.capacity}
                </p>
              </div>
              {isTourActive && (
                <button
                  onClick={() => handleStatusChange(location.id)}
                  className={`realtime-status__button ${
                    location.current_users?.some(
                      (user) => user.user_id === localStorage.getItem("userId")
                    )
                      ? "realtime-status__button--leave"
                      : location.current_occupancy >= location.capacity
                      ? "realtime-status__button--full"
                      : "realtime-status__button--enter"
                  }`}
                >
                  {location.current_users?.some(
                    (user) => user.user_id === localStorage.getItem("userId")
                  )
                    ? "Leave"
                    : location.current_occupancy >= location.capacity
                    ? "Full"
                    : "Enter"}
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
