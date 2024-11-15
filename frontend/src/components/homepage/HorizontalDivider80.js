import React from 'react';

const styles = {
  HorizontalDivider: {
    width: '80%', // Adjust to take 80% of the viewport width for responsiveness
    height: '2px', // Keep the height fixed
    backgroundColor: '#c1c2c2', // Divider color
    borderRadius: '2px', // Rounded edges
    margin: '0 auto', // Centers the divider horizontally
  },
};

const HorizontalDivider = (props) => {
  return (
    <div style={styles.HorizontalDivider} />
  );
};

export default HorizontalDivider;
