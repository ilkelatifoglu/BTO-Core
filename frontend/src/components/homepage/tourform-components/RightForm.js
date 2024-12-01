// src/components/homepage/tourform-components/RightForm.js

import React from 'react';
import './RightForm.css';
import PropTypes from 'prop-types';

const RightForm = ({
  responsibleName,
  setResponsibleName,
  phoneNumber,
  setPhoneNumber,
  email,
  setEmail,
  visitorNotes,
  setVisitorNotes,
}) => {
  // Handler for phone number input with formatting (e.g., 0 XXX XXX XX XX)
  const handlePhoneNumberChange = (e) => {
    // Remove all non-digit characters
    let input = e.target.value.replace(/\D/g, '').substring(0, 11); // Limit to 11 digits

    // Format the phone number as 0 XXX XXX XX XX
    let formattedNumber = '';
    if (input.length > 0) {
      formattedNumber = '0';
    }
    if (input.length > 1 && input.length <= 4) {
      formattedNumber += ` ${input.substring(1)}`;
    } else if (input.length > 4 && input.length <= 7) {
      formattedNumber += ` ${input.substring(1, 4)} ${input.substring(4)}`;
    } else if (input.length > 7 && input.length <= 9) {
      formattedNumber += ` ${input.substring(1, 4)} ${input.substring(4, 7)} ${input.substring(7)}`;
    } else if (input.length > 9) {
      formattedNumber += ` ${input.substring(1, 4)} ${input.substring(4, 7)} ${input.substring(7, 9)} ${input.substring(9)}`;
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
          required
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
          required
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
          required
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

// PropTypes for type checking and ensuring required props are passed
RightForm.propTypes = {
  responsibleName: PropTypes.string.isRequired,
  setResponsibleName: PropTypes.func.isRequired,
  phoneNumber: PropTypes.string.isRequired,
  setPhoneNumber: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  visitorNotes: PropTypes.string.isRequired,
  setVisitorNotes: PropTypes.func.isRequired,
};

export default RightForm;
