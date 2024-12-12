const { query } = require("../config/database");

class TourLocationService {
  async getAllLocations() {
    try {
      const result = await query(
        `SELECT 
          t.id::text as id,
          t.name,
          t.latitude,
          t.longitude,
          t.capacity,
          t.current_occupancy,
          CASE 
            WHEN t.current_occupancy = 0 THEN 'empty'
            WHEN t.current_occupancy = t.capacity THEN 'full'
            ELSE 'partial'
          END as status,
          COALESCE(
            (
              SELECT json_agg(
                json_build_object(
                  'user_id', ul.user_id::text,
                  'user_name', CONCAT(u.first_name, ' ', u.last_name),
                  'joined_at', (ul.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Istanbul')
                )
              )
              FROM user_locations ul
              JOIN users u ON ul.user_id::text = u.id::text
              WHERE ul.location_id::text = t.id::text
            ),
            '[]'
          ) as current_users
        FROM tour_locations t`,
        []
      );

      console.log("Query result:", result.rows); // Add this for debugging
      return result.rows;
    } catch (error) {
      console.error("Error in getAllLocations:", error);
      throw error;
    }
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
    try {
      await query("BEGIN");

      // First check if user already occupies any location
      const occupiedLocation = await query(
        `SELECT location_id FROM user_locations WHERE user_id = $1`,
        [userId]
      );

      if (occupiedLocation.rows.length > 0) {
        await query("ROLLBACK");
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
        await query(
          `INSERT INTO user_locations (user_id, location_id) VALUES ($1, $2)`,
          [userId, id]
        );
      }

      await query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await query("ROLLBACK");
      throw error;
    }
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
            'user_name', CONCAT(u.first_name, ' ', u.last_name),
            'joined_at', ul.created_at
          )
        ) FILTER (WHERE ul.user_id IS NOT NULL) as current_users
      FROM tour_locations t
      LEFT JOIN user_locations ul ON t.id = ul.location_id
      LEFT JOIN users u ON ul.user_id = u.id
      WHERE t.id = $1
      GROUP BY t.id`,
      [id]
    );
    return result.rows[0];
  }

  async resetAllOccupancies() {
    try {
      await query("BEGIN");

      // Clear all user_locations
      await query("DELETE FROM user_locations");

      // Reset all occupancies to 0
      await query(
        `UPDATE tour_locations 
         SET current_occupancy = 0`
      );

      await query("COMMIT");
      return true;
    } catch (error) {
      await query("ROLLBACK");
      console.error("Error resetting occupancies:", error);
      throw error;
    }
  }
}

module.exports = new TourLocationService();
