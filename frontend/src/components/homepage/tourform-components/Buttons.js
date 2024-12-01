// src/components/homepage/tourform-components/Buttons.js

import React from 'react';
import './Buttons.css';
import PropTypes from 'prop-types';

const Buttons = ({ handleClear }) => {
  return (
    <div className="buttons-container">
      {/* Submit Button */}
      <button type="submit" className="submit-button">
        Submit Your Application
      </button>

      {/* Clear Button */}
      <button type="button" className="clear-button" onClick={handleClear}>
        Clear the Form
      </button>
    </div>
  );
};

// PropTypes for type checking and ensuring required props are passed
Buttons.propTypes = {
  handleClear: PropTypes.func.isRequired,
};

export default Buttons;
