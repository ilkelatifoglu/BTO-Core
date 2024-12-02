// src/components/homepage/tourform-components/LeftForm.js

import React from 'react';
import './LeftForm.css';
import Select from 'react-select';
import PropTypes from 'prop-types';

const LeftForm = ({
  city,
  setCity,
  schoolName,
  setSchoolName,
  numberOfStudents,
  setNumberOfStudents,
  tourDate,
  setTourDate,
  selectedTimes,
  setSelectedTimes,
}) => {
  // List of Turkish cities
  const citiesList = [
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

  // Convert cities array to options for react-select
  const cityOptions = citiesList.map((cityName) => ({
    value: cityName,
    label: cityName,
  }));

  // Predefined tour start times
  const timeOptions = ['09:00', '11:00', '13:30', '16:00'];

  // Handler to add a new time preference slot
  const addTimePreference = () => {
    setSelectedTimes([...selectedTimes, '']);
  };

  // Handler to update a specific time preference
  const handleTimeChange = (index, value) => {
    const updatedSelectedTimes = [...selectedTimes];
    updatedSelectedTimes[index] = value;

    // Ensure that each time preference is unique
    setSelectedTimes(updatedSelectedTimes);
  };

  // Handler to remove a specific time preference slot
  const removeTimePreference = (index) => {
    const updatedSelectedTimes = selectedTimes.filter((_, i) => i !== index);
    setSelectedTimes(updatedSelectedTimes);
  };

  // Handler for number of students input with validation
  const handleNumberOfStudentsChange = (e) => {
    const value = e.target.value;
    // Allow only digits, and limit to values between 0 and 300
    if (
      /^\d{0,3}$/.test(value) &&
      (value === '' || (Number(value) >= 0 && Number(value) <= 300))
    ) {
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
          required
          filterOption={(candidate, input) => {
            const candidateLabel = candidate.label.toLocaleLowerCase('tr'); // Convert label to lowercase using Turkish locale
            const inputValue = input.toLocaleLowerCase('tr'); // Convert input to lowercase using Turkish locale
            return candidateLabel.includes(inputValue); // Perform case-insensitive search
          }}
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
          required
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
          placeholder="0-300"
          value={numberOfStudents}
          onChange={handleNumberOfStudentsChange}
          required
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
          required
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
              required
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

// PropTypes for type checking and ensuring required props are passed
LeftForm.propTypes = {
  city: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  setCity: PropTypes.func.isRequired,
  schoolName: PropTypes.string.isRequired,
  setSchoolName: PropTypes.func.isRequired,
  numberOfStudents: PropTypes.string.isRequired,
  setNumberOfStudents: PropTypes.func.isRequired,
  tourDate: PropTypes.string.isRequired,
  setTourDate: PropTypes.func.isRequired,
  selectedTimes: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSelectedTimes: PropTypes.func.isRequired,
};

export default LeftForm;
