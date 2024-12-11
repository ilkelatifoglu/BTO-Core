const { query } = require("../config/database");

class TourLocationService {
  async getAllLocations() {
    const result = await query(
      "SELECT id, name, latitude, longitude, capacity, current_occupancy FROM tour_locations"
    );
    return result.rows;
  }

  async getLocationById(id) {
    const result = await query(
      "SELECT id, name, latitude, longitude, capacity, current_occupancy FROM tour_locations WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }

  async createLocation(locationData) {
    const { name, latitude, longitude, capacity } = locationData;
    const result = await query(
      "INSERT INTO tour_locations (name, latitude, longitude, capacity) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, latitude, longitude, capacity]
    );
    return result.rows[0];
  }

  async updateLocation(id, locationData) {
    const { name, latitude, longitude, capacity } = locationData;
    const result = await query(
      "UPDATE tour_locations SET name = $1, latitude = $2, longitude = $3, capacity = $4 WHERE id = $5 RETURNING *",
      [name, latitude, longitude, capacity, id]
    );
    return result.rows[0];
  }

  async deleteLocation(id) {
    const result = await query(
      "DELETE FROM tour_locations WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  async incrementOccupancy(id) {
    const result = await query(
      `UPDATE tour_locations 
       SET current_occupancy = current_occupancy + 1 
       WHERE id = $1 
       AND current_occupancy < capacity 
       RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  async decrementOccupancy(id) {
    const result = await query(
      `UPDATE tour_locations 
       SET current_occupancy = current_occupancy - 1 
       WHERE id = $1 
       AND current_occupancy > 0 
       RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  async isLocationAvailable(id) {
    const result = await query(
      "SELECT current_occupancy < capacity as is_available FROM tour_locations WHERE id = $1",
      [id]
    );
    return result.rows[0]?.is_available || false;
  }
}

module.exports = new TourLocationService();
