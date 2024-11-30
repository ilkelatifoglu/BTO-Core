import React from 'react';

const Buttons = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
      <button style={{ flex: 1, marginRight: '10px', padding: '10px' }}>Submit Your Application</button>
      <button style={{ flex: 1, marginLeft: '10px', padding: '10px' }}>Clear the Form</button>
    </div>
  );
};

export default Buttons;
