const tourLocationService = require("../services/TourLocationService");

exports.getAllLocations = async (req, res) => {
  try {
    const locations = await tourLocationService.getAllLocations();
    res.json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Failed to fetch locations" });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const location = await tourLocationService.getLocationById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json(location);
  } catch (error) {
    console.error("Error fetching location:", error);
    res.status(500).json({ message: "Failed to fetch location" });
  }
};

exports.createLocation = async (req, res) => {
  try {
    const { name, latitude, longitude, capacity } = req.body;

    if (!name || !latitude || !longitude || !capacity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const location = await tourLocationService.createLocation(req.body);
    res.status(201).json(location);
  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({ message: "Failed to create location" });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const location = await tourLocationService.updateLocation(
      req.params.id,
      req.body
    );
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json(location);
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ message: "Failed to update location" });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const location = await tourLocationService.deleteLocation(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json({ message: "Location deleted successfully" });
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({ message: "Failed to delete location" });
  }
};

exports.startTour = async (req, res) => {
  try {
    const { locationId, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const isAvailable = await tourLocationService.isLocationAvailable(
      locationId
    );
    if (!isAvailable) {
      return res.status(400).json({ message: "Location is at full capacity" });
    }

    const location = await tourLocationService.incrementOccupancy(
      locationId,
      userId
    );
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.json(location);
  } catch (error) {
    console.error("Error starting tour:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.endTour = async (req, res) => {
  try {
    const { locationId, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const location = await tourLocationService.decrementOccupancy(
      locationId,
      userId
    );
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.json(location);
  } catch (error) {
    console.error("Error ending tour:", error);
    res.status(500).json({ message: error.message });
  }
};
