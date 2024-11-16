import React from 'react';

const styles = {
  HorizontalDivider: {
    width: '100%', // Adjust to take 80% of the viewport width for responsiveness
    height: '2px', // Keep the height fixed
    backgroundColor: '#c1c2c2', // Divider color
    borderRadius: '2px', // Rounded edges
    margin: '20px auto', // Centers the divider horizontally
  },
};

const HorizontalDivider = (props) => {
  return (
    <div style={styles.HorizontalDivider} />
  );
};

export default HorizontalDivider;
