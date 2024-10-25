// src/components/Button.jsx
import React from 'react';

const MyButton = ({ label = 'Click me Ahmad', onClick }) => {
  return (
    <button onClick={onClick} className="bg-blue-500 text-white">
      {label}
    </button>
  );
};

export default MyButton;
