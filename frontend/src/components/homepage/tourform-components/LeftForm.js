import React from 'react';

const LeftForm = () => {
  return (
    <div style={{ flex: 1, paddingRight: '10px' }}>
      <label>City Your School Resides In</label>
      <input type="text" placeholder="Ankara" style={{ width: '100%', marginBottom: '10px' }} />

      <label>School Name</label>
      <input type="text" placeholder="Ankara Atatürk Anatolian High School" style={{ width: '100%', marginBottom: '10px' }} />

      <label>Number of Students Joining the Tour</label>
      <input type="number" placeholder="0-60" style={{ width: '100%', marginBottom: '10px' }} />

      <label>Preferred Date for the Tour</label>
      <input type="text" placeholder="Monday" style={{ width: '100%', marginBottom: '10px' }} />

      <label>Tour Start Time Preferences</label>
      <div>
        <input type="checkbox" id="time1" />
        <label htmlFor="time1">09:00</label>
        <br />
        <input type="checkbox" id="time2" />
        <label htmlFor="time2">11:00</label>
      </div>
    </div>
  );
};

export default LeftForm;
