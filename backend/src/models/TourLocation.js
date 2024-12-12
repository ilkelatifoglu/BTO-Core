class TourLocation {
  constructor({
    id = null,
    name,
    latitude,
    longitude,
    capacity,
    currentOccupancy = 0,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.id = id;
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.capacity = capacity;
    this.currentOccupancy = currentOccupancy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.validate();
  }

  validate() {
    if (!this.name || typeof this.name !== "string") {
      throw new Error("Name is required and must be a string");
    }

    if (!this.isValidLatitude(this.latitude)) {
      throw new Error("Invalid latitude value");
    }

    if (!this.isValidLongitude(this.longitude)) {
      throw new Error("Invalid longitude value");
    }

    if (!Number.isInteger(this.capacity) || this.capacity <= 0) {
      throw new Error("Capacity must be a positive integer");
    }

    if (!Number.isInteger(this.currentOccupancy) || this.currentOccupancy < 0) {
      throw new Error("Current occupancy must be a non-negative integer");
    }

    if (this.currentOccupancy > this.capacity) {
      throw new Error("Current occupancy cannot exceed capacity");
    }
  }

  isValidLatitude(lat) {
    return !isNaN(lat) && lat >= -90 && lat <= 90;
  }

  isValidLongitude(lon) {
    return !isNaN(lon) && lon >= -180 && lon <= 180;
  }

  isAvailable() {
    return this.currentOccupancy < this.capacity;
  }

  getOccupancyPercentage() {
    return (this.currentOccupancy / this.capacity) * 100;
  }

  getRemainingCapacity() {
    return this.capacity - this.currentOccupancy;
  }

  incrementOccupancy() {
    if (!this.isAvailable()) {
      throw new Error("Location is at full capacity");
    }
    this.currentOccupancy += 1;
    this.updatedAt = new Date();
  }

  decrementOccupancy() {
    if (this.currentOccupancy <= 0) {
      throw new Error("Occupancy is already at 0");
    }
    this.currentOccupancy -= 1;
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      latitude: this.latitude,
      longitude: this.longitude,
      capacity: this.capacity,
      currentOccupancy: this.currentOccupancy,
      isAvailable: this.isAvailable(),
      occupancyPercentage: this.getOccupancyPercentage(),
      remainingCapacity: this.getRemainingCapacity(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Convert database row to TourLocation instance
  static fromDatabase(row) {
    return new TourLocation({
      id: row.id,
      name: row.name,
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude),
      capacity: row.capacity,
      currentOccupancy: row.current_occupancy,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  // Create database insert object
  toDatabaseInsert() {
    return {
      name: this.name,
      latitude: this.latitude,
      longitude: this.longitude,
      capacity: this.capacity,
      current_occupancy: this.currentOccupancy,
    };
  }
}

module.exports = TourLocation;
