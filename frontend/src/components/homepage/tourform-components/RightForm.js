import React, { useState } from 'react';
import './RightForm.css';

const RightForm = () => {
  const [responsibleName, setResponsibleName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [visitorNotes, setVisitorNotes] = useState('');

  const handlePhoneNumberChange = (e) => {
    let input = e.target.value.replace(/\D/g, '').substring(0, 11); // Limit to 11 digits
    let formattedNumber = '';
  
    if (input.length > 0) {
      formattedNumber = `0`;
    }
    if (input.length > 1 && input.length <= 4) {
      formattedNumber = `0 ${input.substring(1)}`;
    } else if (input.length > 4 && input.length <= 7) {
      formattedNumber = `0 ${input.substring(1, 4)} ${input.substring(4)}`;
    } else if (input.length > 7 && input.length <= 9) {
      formattedNumber = `0 ${input.substring(1, 4)} ${input.substring(4, 7)} ${input.substring(7)}`;
    } else if (input.length > 9) {
      formattedNumber = `0 ${input.substring(1, 4)} ${input.substring(4, 7)} ${input.substring(7, 9)} ${input.substring(9)}`;
    }
    setPhoneNumber(formattedNumber);
  };
  

  return (
    <div className="right-form">
      {/* Responsible Person's Name */}
      <div className="form-group">
        <label htmlFor="responsibleName">Responsible Person's Name</label>
        <input
          type="text"
          id="responsibleName"
          name="responsibleName"
          className="form-control"
          placeholder="Fatma"
          value={responsibleName}
          onChange={(e) => setResponsibleName(e.target.value)}
        />
      </div>

      {/* Responsible Person's Phone Number */}
      <div className="form-group">
        <label htmlFor="phoneNumber">Responsible Person's Phone Number</label>
        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          className="form-control"
          placeholder="0 XXX XXX XX XX"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
        />
      </div>

      {/* Responsible Person's Email */}
      <div className="form-group">
        <label htmlFor="email">Responsible Person's Email</label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-control"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Visitor Notes */}
      <div className="form-group">
        <label htmlFor="visitorNotes">Visitor Notes</label>
        <textarea
          id="visitorNotes"
          name="visitorNotes"
          className="form-control"
          placeholder="If you have anything to share with us, please add it here."
          value={visitorNotes}
          onChange={(e) => setVisitorNotes(e.target.value)}
        />
      </div>
    </div>
  );
};

export default RightForm;
