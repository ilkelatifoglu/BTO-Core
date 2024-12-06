export const fetchTourData = async (filter, periodIndex) => {
  try {
    const response = await fetch(`http://localhost:3001/data/${filter}/${periodIndex}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tour data:", error);
    throw error;
  }
};

export const fetchSchoolStudentData = async () => {
  const response = await fetch(`http://localhost:3001/data/school-student-data`);
  if (!response.ok) {
    throw new Error("Failed to fetch school student data");
  }
  return response.json();
};
