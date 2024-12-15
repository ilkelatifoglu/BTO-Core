const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";
const token = localStorage.getItem("token") || localStorage.getItem("tempToken");

export const fetchTourData = async (filter, periodIndex) => {
  try {
    const response = await fetch(`${BASE_URL}/data/${filter}/${periodIndex}`, {headers: {Authorization: `Bearer ${token}`}}); // Correct endpoint
    if (!response.ok) {
      throw new Error("Failed to fetch tour data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tour data:", error);
    throw error;
  }
};

export const fetchSchoolStudentData = async (year) => { // Ensure 'year' is required
  try {
    const response = await fetch(`${BASE_URL}/data/school/yearly/${year}`, {headers: {Authorization: `Bearer ${token}`}}); // Correct endpoint
    if (!response.ok) {
      throw new Error("Failed to fetch school student data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching school student data:", error);
    throw error;
  }
};
