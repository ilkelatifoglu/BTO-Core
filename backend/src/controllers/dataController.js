// Mock Data
const mockData = {
  weekly: {
    toursArranged: [6, 8, 3, 4, 7],
    toursByCity: {
      Ankara: 12,
      Bursa: 8,
      Izmir: 5,
      Konya: 10,
      Rize: 3,
      Igdir: 2,
      Ordu: 4,
      Sivas: 6,
      Usak: 1,
    },
    students: 50,
    highschoolStudents: { pastTours: 30, currentBilkent: 20 },
    tourDays: {
      Monday: 16,
      Tuesday: 14,
      Wednesday: 15,
      Thursday: 18,
      Friday: 25,
      Saturday: 5,
      Sunday: 4, // Sunday is here
    },
    cancellationStats: { completed: 400, cancelled: 100 },
  },
  monthly: {
    toursArranged: [20, 15, 25, 18, 22],
    toursByCity: {
      Ankara: 40,
      Bursa: 25,
      Izmir: 15,
      Konya: 30,
      Rize: 10,
      Igdir: 8,
      Ordu: 12,
      Sivas: 18,
      Usak: 4,
    },
    students: 200,
    highschoolStudents: { pastTours: 150, currentBilkent: 50 },
    tourDays: {
      Monday: 20,
      Tuesday: 15,
      Wednesday: 30,
      Thursday: 25,
      Friday: 10,
      Saturday: 5,
      Sunday: 7, // Sunday is here
    },
    cancellationStats: { completed: 1200, cancelled: 300 },
  },
  yearly: {
    toursArranged: [200, 180, 220, 190, 210],
    toursByCity: {
      Ankara: 400,
      Bursa: 250,
      Izmir: 150,
      Konya: 300,
      Rize: 100,
      Igdir: 80,
      Ordu: 120,
      Sivas: 180,
      Usak: 40,
    },
    students: 1000,
    highschoolStudents: { pastTours: 700, currentBilkent: 300 },
    tourDays: {
      Monday: 16,
      Tuesday: 18,
      Wednesday: 22,
      Thursday: 20,
      Friday: 14,
      Saturday: 10,
      Sunday: 7, // Sunday is here
    },
    cancellationStats: { completed: 5000, cancelled: 1000 },
  },
};

// Controller function
exports.getData = (req, res) => {
  const { filter } = req.params;
  if (!mockData[filter]) {
    return res.status(400).json({ error: "Invalid filter type" });
  }
  res.json(mockData[filter]);
};
