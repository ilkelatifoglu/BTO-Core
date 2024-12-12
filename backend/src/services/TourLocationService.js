const { query } = require("../config/database");

class TourLocationService {
  async getAllLocations() {
    const result = await query(
      `SELECT 
        t.id, 
        t.name, 
        t.latitude, 
        t.longitude, 
        t.capacity, 
        t.current_occupancy,
        CASE 
          WHEN t.current_occupancy = 0 THEN 'empty'
          WHEN t.current_occupancy = capacity THEN 'full'
          ELSE 'partial'
        END as status,
        json_agg(
          json_build_object(
            'user_id', ul.user_id,
            'joined_at', ul.created_at
          )
        ) FILTER (WHERE ul.user_id IS NOT NULL) as current_users
      FROM tour_locations t
      LEFT JOIN user_locations ul ON t.id = ul.location_id
      GROUP BY t.id`
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

  async incrementOccupancy(id, userId) {
    // First check if user already occupies a location
    const occupiedLocation = await query(
      `SELECT id FROM tour_locations 
       WHERE current_occupancy > 0 
       AND EXISTS (
         SELECT 1 FROM user_locations 
         WHERE location_id = tour_locations.id 
         AND user_id = $1
       )`,
      [userId]
    );

    if (occupiedLocation.rows.length > 0) {
      throw new Error("User already occupies a location");
    }

    const result = await query(
      `UPDATE tour_locations 
       SET current_occupancy = current_occupancy + 1 
       WHERE id = $1 
       AND current_occupancy < capacity 
       RETURNING *, 
       CASE 
         WHEN current_occupancy = 0 THEN 'empty'
         WHEN current_occupancy = capacity THEN 'full'
         ELSE 'partial'
       END as status`,
      [id]
    );

    if (result.rows[0]) {
      // Record user's occupation
      await query(
        `INSERT INTO user_locations (user_id, location_id) VALUES ($1, $2)`,
        [userId, id]
      );
    }

    return result.rows[0];
  }

  async decrementOccupancy(id, userId) {
    // Check if user actually occupies this location
    const userOccupation = await query(
      `SELECT 1 FROM user_locations 
       WHERE location_id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (userOccupation.rows.length === 0) {
      throw new Error("User does not occupy this location");
    }

    const result = await query(
      `UPDATE tour_locations 
       SET current_occupancy = current_occupancy - 1 
       WHERE id = $1 
       AND current_occupancy > 0 
       RETURNING *, 
       CASE 
         WHEN current_occupancy = 0 THEN 'empty'
         WHEN current_occupancy = capacity THEN 'full'
         ELSE 'partial'
       END as status`,
      [id]
    );

    if (result.rows[0]) {
      // Remove user's occupation record
      await query(
        `DELETE FROM user_locations WHERE user_id = $1 AND location_id = $2`,
        [userId, id]
      );
    }

    return result.rows[0];
  }

  async isLocationAvailable(id) {
    const result = await query(
      "SELECT current_occupancy < capacity as is_available FROM tour_locations WHERE id = $1",
      [id]
    );
    return result.rows[0]?.is_available || false;
  }

  async getLocationWithUsers(id) {
    const result = await query(
      `SELECT 
        t.id, 
        t.name, 
        t.latitude, 
        t.longitude, 
        t.capacity, 
        t.current_occupancy,
        CASE 
          WHEN t.current_occupancy = 0 THEN 'empty'
          WHEN t.current_occupancy = capacity THEN 'full'
          ELSE 'partial'
        END as status,
        json_agg(
          json_build_object(
            'user_id', ul.user_id,
            'joined_at', ul.created_at
          )
        ) FILTER (WHERE ul.user_id IS NOT NULL) as current_users
      FROM tour_locations t
      LEFT JOIN user_locations ul ON t.id = ul.location_id
      WHERE t.id = $1
      GROUP BY t.id`,
      [id]
    );
    return result.rows[0];
  }
}

module.exports = new TourLocationService();
