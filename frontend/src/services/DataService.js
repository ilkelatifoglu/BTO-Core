import axios from "axios";

export const fetchTourData = async (filter) => {
  try {
    const response = await axios.get(`http://localhost:3001/data/${filter}`);
    return response.data; // Now contains tourStatusData, tourDays, and toursByCity
  } catch (error) {
    console.error("Error fetching tour data:", error);
    throw new Error("Failed to fetch tour data.");
  }
};
