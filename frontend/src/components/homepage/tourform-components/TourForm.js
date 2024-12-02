
import React, { useState } from 'react';
import './TourForm.css';
import Title from './Title';
import LeftForm from './LeftForm';
import RightForm from './RightForm';
import Buttons from './Buttons';

const TourForm = () => {
  // ============================
  // State Variables for LeftForm
  // ============================

  const [errorMessage, setErrorMessage] = useState('');
  
  const [city, setCity] = useState({ value: 'Ankara', label: 'Ankara' });
  const [schoolName, setSchoolName] = useState('');
  const [numberOfStudents, setNumberOfStudents] = useState('');
  const [tourDate, setTourDate] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);

  // =============================
  // State Variables for RightForm
  // =============================

  const [responsibleName, setResponsibleName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [visitorNotes, setVisitorNotes] = useState('');

  // ==========================
  // Handler to Reset All Fields
  // ==========================

  const handleClear = () => {
    // Reset LeftForm fields
    setCity({ value: 'Ankara', label: 'Ankara' });
    setSchoolName('');
    setNumberOfStudents('');
    setTourDate('');
    setSelectedTimes([]);

    // Reset RightForm fields
    setResponsibleName('');
    setPhoneNumber('');
    setEmail('');
    setVisitorNotes('');
  };

  // ============================
  // Handler for Form Submission
  // ============================

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Construct the JSON object as per backend requirements
    const submissionData = {
      school_name: schoolName,
      city: city.value,
      academic_year_start: new Date().getFullYear(),
      date: tourDate, // Already in 'YYYY-MM-DD' format from date input
      tour_size: Number(numberOfStudents),
      teacher_name: responsibleName,
      teacher_phone: phoneNumber.replace(/\s/g, ''), // Remove spaces
      teacher_email: email,
      time_preferences: selectedTimes.filter((time) => time !== ''),
      visitor_notes: visitorNotes,
    };

    console.log('Submitting Data:', submissionData); // For debugging

    try {
        const response = await fetch('http://localhost:3001/tour/addTour', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData),
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log('Success:', data);
          alert('Your application has been submitted successfully!');
          handleClear();
          setErrorMessage(''); // Clear any previous error messages
        } else {
          const errorData = await response.json();
          console.error('Error submitting form:', errorData.message || response.statusText);
          setErrorMessage(errorData.message || 'An error occurred while submitting the form.');
        }
      } catch (error) {
        console.error('Network Error:', error);
        setErrorMessage('Network error. Please check your connection and try again.');
      }
    };

  return (
    <form className="tour-form-container" onSubmit={handleSubmit}>
      <div className="tour-form-inner">
        <Title />
        <div className="tour-form-sections">
          <LeftForm
            city={city}
            setCity={setCity}
            schoolName={schoolName}
            setSchoolName={setSchoolName}
            numberOfStudents={numberOfStudents}
            setNumberOfStudents={setNumberOfStudents}
            tourDate={tourDate}
            setTourDate={setTourDate}
            selectedTimes={selectedTimes}
            setSelectedTimes={setSelectedTimes}
          />
          <RightForm
            responsibleName={responsibleName}
            setResponsibleName={setResponsibleName}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            email={email}
            setEmail={setEmail}
            visitorNotes={visitorNotes}
            setVisitorNotes={setVisitorNotes}
          />
        </div>
        <Buttons handleClear={handleClear} />
      </div>
    </form>
  );
};

export default TourForm;
