import React from 'react';

const RightForm = () => {
  return (
    <div style={{ flex: 1, paddingLeft: '10px' }}>
      <label>Responsible Person's Name</label>
      <input type="text" placeholder="Fatma" style={{ width: '100%', marginBottom: '10px' }} />

      <label>Responsible Person's Phone Number</label>
      <input type="text" placeholder="XXX XXX XX XX" style={{ width: '100%', marginBottom: '10px' }} />

      <label>Responsible Person's Email</label>
      <input type="email" placeholder="example@gmail.com" style={{ width: '100%', marginBottom: '10px' }} />

      <label>Visitor Notes</label>
      <textarea placeholder="If you have anything to share with us, please add it here." style={{ width: '100%' }} />
    </div>
  );
};

export default RightForm;
