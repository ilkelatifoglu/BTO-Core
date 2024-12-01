import React, { useState } from 'react';
import './LeftForm.css';
// Import React Select for searchable dropdown
import Select from 'react-select';

const LeftForm = () => {
  // Cities array
  const cities = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
    'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik',
    'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli',
    'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep',
    'Giresun', 'Gümüşhane', 'Hakkâri', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir',
    'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis', 'Kırıkkale',
    'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin',
    'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya',
    'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop', 'Sivas', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon',
    'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak',
  ];

  const cityOptions = cities.map((city) => ({ value: city, label: city }));

  const timeOptions = ['09:00', '11:00', '13:30', '16:00'];

  const [city, setCity] = useState({ value: 'Ankara', label: 'Ankara' });
  const [schoolName, setSchoolName] = useState('');
  const [numberOfStudents, setNumberOfStudents] = useState('');
  const [tourDate, setTourDate] = useState(''); // Initialize as empty string
  const [availableTimes, setAvailableTimes] = useState(timeOptions);
  const [selectedTimes, setSelectedTimes] = useState([]);

  // Handle adding time preference
  const addTimePreference = () => {
    setSelectedTimes([...selectedTimes, '']);
  };

  // Handle time selection change
  const handleTimeChange = (index, value) => {
    const updatedSelectedTimes = [...selectedTimes];
    updatedSelectedTimes[index] = value;

    // Remove selected times from available times
    const usedTimes = updatedSelectedTimes.filter((time) => time !== '');
    const updatedAvailableTimes = timeOptions.filter((time) => !usedTimes.includes(time));

    setSelectedTimes(updatedSelectedTimes);
    setAvailableTimes(updatedAvailableTimes);
  };

  // Remove time preference
  const removeTimePreference = (index) => {
    const timeToRemove = selectedTimes[index];
    const updatedSelectedTimes = selectedTimes.filter((_, i) => i !== index);

    // Update available times
    const updatedAvailableTimes = timeToRemove
      ? [...availableTimes, timeToRemove]
      : availableTimes;

    setSelectedTimes(updatedSelectedTimes);
    setAvailableTimes(updatedAvailableTimes);
  };

  // Handle number of students input
  const handleNumberOfStudentsChange = (e) => {
    const value = e.target.value;
    // Allow only digits, and limit to values between 0 and 500
    if (/^\d{0,3}$/.test(value) && (value === '' || (Number(value) >= 0 && Number(value) <= 500))) {
      setNumberOfStudents(value);
    }
  };

  return (
    <div className="left-form">
      {/* City Selection */}
      <div className="form-group">
        <label htmlFor="city">City Your School Resides In</label>
        <Select
          id="city"
          name="city"
          className="react-select-container"
          classNamePrefix="react-select"
          options={cityOptions}
          value={city}
          onChange={(selectedOption) => setCity(selectedOption)}
          placeholder="Select City"
          isSearchable
        />
      </div>

      {/* School Name */}
      <div className="form-group">
        <label htmlFor="schoolName">School Name</label>
        <input
          type="text"
          id="schoolName"
          name="schoolName"
          className="form-control"
          placeholder="Ankara Atatürk Anatolian High School"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
        />
      </div>

      {/* Number of Students */}
      <div className="form-group">
        <label htmlFor="numberOfStudents">Number of Students Joining the Tour</label>
        <input
          type="text"
          id="numberOfStudents"
          name="numberOfStudents"
          className="form-control"
          placeholder="0-500"
          value={numberOfStudents}
          onChange={handleNumberOfStudentsChange}
        />
      </div>

      {/* Preferred Tour Date */}
      <div className="form-group">
        <label htmlFor="tourDate">Preferred Date for the Tour</label>
        <input
          type="date"
          id="tourDate"
          name="tourDate"
          className="form-control"
          value={tourDate}
          onChange={(e) => setTourDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]} // Set min date to today
        />
      </div>

      {/* Tour Start Time Preferences */}
      <div className="form-group">
        <label>Tour Start Time Preferences</label>
        {selectedTimes.map((time, index) => (
          <div key={index} className="time-slot">
            <select
              className="form-control"
              value={time}
              onChange={(e) => handleTimeChange(index, e.target.value)}
            >
              <option value="" disabled>
                Select Time
              </option>
              {timeOptions.map((availableTime) =>
                !selectedTimes.includes(availableTime) || availableTime === time ? (
                  <option key={availableTime} value={availableTime}>
                    {availableTime}
                  </option>
                ) : null
              )}
            </select>
            <button
              type="button"
              className="remove-button"
              onClick={() => removeTimePreference(index)}
              disabled={selectedTimes.length <= 1} // Prevent removing last time
            >
              &minus;
            </button>
          </div>
        ))}
        {selectedTimes.length < timeOptions.length && (
          <button
            type="button"
            className="add-button"
            onClick={addTimePreference}
          >
            &#43; Add Preference
          </button>
        )}
      </div>
    </div>
  );
};

export default LeftForm;
