import React, { useState, useEffect, useRef } from "react";
import Map, {
  Marker,
  Popup,
  AttributionControl,
  NavigationControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, RefreshCw, Crosshair, ArrowLeft } from "lucide-react";
import "./RealtimeStatus.css";
import { Toast } from "primereact/toast";

import useProtectRoute from "../hooks/useProtectRoute";
import Unauthorized from "./Unauthorized";

const BILKENT_BOUNDS = [
  [32.73, 39.85], // Southwest coordinates [lng, lat]
  [32.77, 39.89], // Northeast coordinates [lng, lat]
];

const BILKENT_CENTER = {
  longitude: 32.75,
  latitude: 39.87,
  zoom: 15,
};

const RealtimeStatus = () => {
  // TODO: change user types
  const isAuthorized = useProtectRoute([1, 2, 3, 4]);

  const MOCK_USER_LOCATION = {
    latitude: 39.868201,
    longitude: 32.749127,
  };
  const token = localStorage.getItem("token") || localStorage.getItem("tempToken");
  const [userLocation, setUserLocation] = useState(MOCK_USER_LOCATION);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isTourActive, setIsTourActive] = useState(false);
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationDenied, setLocationDenied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState("coordinator");

  const mapRef = useRef();
  const toast = useRef(null);

  // Add new state for map initialization
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleNavigateBack = () => {
    window.history.back();
  };

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

    // Optional: Check if the token exists before making the request
    if (!token) {
        console.error('No authentication token found. Please log in.');
        setError('No authentication token found. Please log in.');
        return;
    }

    try {
          const response = await fetch(
              `${process.env.REACT_APP_BACKEND_URL}/tour-locations/`,
              {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`, // Include the token here
                  },
              }
          );

          if (!response.ok) {
              // Optionally, parse error details from the response
              const errorData = await response.json();
              throw new Error(
                  `Failed to fetch locations: ${response.status} ${response.statusText} - ${errorData.message || ''}`
              );
          }

          const data = await response.json();
          setLocations(data);
          return data;
      } catch (error) {
          console.error("Error fetching locations:", error);
          setError(`Failed to fetch locations: ${error.message}`);
          throw error;
      }
  };

  // Update handleStatusChange function
  const handleStatusChange = async (locationId) => {
    try {
      const isUserInLocation = locations.find((loc) =>
        loc.current_users?.some(
          (user) => user.user_id === localStorage.getItem("userId")
        )
      );

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/tour-locations/${
          isUserInLocation ? "end-tour" : "start-tour"
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userId"),
            locationId: locationId,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      await fetchLocations();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: isUserInLocation ? "Tour ended" : "Tour started",
        life: 3000,
      });
    } catch (error) {
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
    const initializeData = async () => {
      setIsLoading(true);
      try {
        // Get user location and fetch locations in parallel
        await Promise.all([
          new Promise((resolve) => {
            if ("geolocation" in navigator) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  });
                  setLocationDenied(false);
                  resolve();
                },
                (error) => {
                  console.error("Location access denied:", error);
                  setLocationDenied(true);
                  setError("Location access denied");
                  resolve();
                }
              );
            } else {
              resolve();
            }
          }),
          fetchLocations(),
        ]);
      } catch (error) {
        console.error("Error initializing data:", error);
        setError("Failed to initialize data");
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (userLocation && locations.length > 0) {
      sortLocationsByDistance();
    }
  }, [userLocation, locations]);

  const handleStartTour = () => {
    setIsTourActive(true);
    sortLocationsByDistance();
  };

  const handleEndTour = () => {
    setIsTourActive(false);
    setSelectedLocation(null);
    // Here you would save tour data to database
  };

  // Update handleRefresh function
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      await fetchLocations();
      sortLocationsByDistance();
    } catch (error) {
      console.error("Error refreshing locations:", error);
      setError("Failed to refresh locations");
    } finally {
      setIsLoading(false);
    }
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

  const handleResetOccupancies = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/tour-locations/reset-occupancies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reset occupancies");
      }

      await fetchLocations();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "All occupancies have been reset",
        life: 3000,
      });
    } catch (error) {
      console.error("Error resetting occupancies:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to reset occupancies",
        life: 3000,
      });
    }
  };

  if (!isAuthorized) {
    return <Unauthorized/>;
  }

  return (
    <div className="realtime-status">
      <Toast ref={toast} />
      <button
        onClick={handleNavigateBack}
        className="realtime-status__dashboard-button"
      >
        <ArrowLeft size={24} />
      </button>
      <div className="realtime-status__map-container">
        {isLoading ? (
          <div className="realtime-status__loading">
            <div className="realtime-status__loading-spinner"></div>
            <p>Loading locations...</p>
          </div>
        ) : (
          <Map
            ref={mapRef}
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            initialViewState={BILKENT_CENTER}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            maxBounds={BILKENT_BOUNDS}
            minZoom={14}
            maxZoom={18}
            attributionControl={false}
            cooperativeGestures={true}
            onLoad={() => setMapLoaded(true)}
          >
            {mapLoaded && (
              <>
                <AttributionControl
                  customAttribution="Bilkent University"
                  style={{
                    color: "#666",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                  }}
                />

                <NavigationControl position="bottom-left" />

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
                    onClick={(e) => {
                      e.originalEvent.stopPropagation();
                      setSelectedLocation(location);
                    }}
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
                    closeOnClick={true}
                    onClose={() => setSelectedLocation(null)}
                    className="realtime-status__custom-popup"
                  >
                    <div className="realtime-status__popup">
                      <h3 className="realtime-status__popup-title">
                        {selectedLocation.name}
                      </h3>
                      <div className="realtime-status__popup-status">
                        <span
                          className={`status-indicator status-${selectedLocation.status}`}
                        />
                        <p>
                          {selectedLocation.status.charAt(0).toUpperCase() +
                            selectedLocation.status.slice(1)}
                        </p>
                      </div>
                      <p className="realtime-status__popup-occupancy">
                        {selectedLocation.current_occupancy}/
                        {selectedLocation.capacity} visitors
                      </p>

                      {selectedLocation.current_users &&
                        selectedLocation.current_users.length > 0 && (
                          <div className="realtime-status__popup-users">
                            <h4>Current Guides</h4>
                            <ul>
                              {selectedLocation.current_users.map((user) => (
                                <li key={user.user_id}>
                                  <span className="visitor-name">
                                    {user.user_name || "Anonymous"}
                                  </span>
                                  <span className="visitor-time">
                                    {new Date(
                                      user.joined_at
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  </Popup>
                )}

                <div className="realtime-status__map-controls">
                  <button
                    onClick={centerToUser}
                    className="realtime-status__button realtime-status__button--icon realtime-status__button--crosshair"
                  >
                    <Crosshair size={24} color="white" />
                  </button>
                </div>
              </>
            )}
          </Map>
        )}
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
        {userType === "coordinator" && (
          <button
            onClick={handleResetOccupancies}
            className="realtime-status__button realtime-status__button--reset"
            style={{
              backgroundColor: "#dc3545",
              marginLeft: "10px",
            }}
          >
            Reset All
          </button>
        )}
      </div>

      <div className="realtime-status__locations-list">
        <h2 className="realtime-status__list-title">Tour Locations</h2>
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
            <option value="partial">Partial</option>
            <option value="full">Full</option>
          </select>
        </div>

        {isLoading ? (
          <div className="realtime-status__loading">
            <div className="realtime-status__loading-spinner"></div>
            <p>Loading locations...</p>
          </div>
        ) : (
          filteredLocations.map((location) => (
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
                        (user) =>
                          user.user_id === localStorage.getItem("userId")
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
          ))
        )}
      </div>
    </div>
  );
};

export default RealtimeStatus;
