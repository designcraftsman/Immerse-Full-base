import React from 'react';

const Loader = () => (
  <div 
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'inherit',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000 
    }}
  >
    <div className="loader"></div>
  </div>
);

export default Loader;

