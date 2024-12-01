import React from 'react';
import './Buttons.css';

const Buttons = () => {
  return (
    <div className="buttons-container">
      <button type="submit" className="submit-button">
        Submit Your Application
      </button>
      <button type="reset" className="clear-button">
        Clear the Form
      </button>
    </div>
  );
};

export default Buttons;
