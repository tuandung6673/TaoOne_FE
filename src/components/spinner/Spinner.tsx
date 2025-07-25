import React from 'react';
import './Spinner.scss'; // Đường dẫn tới file CSS cho Spinner
import { useSpinner } from '../../custom-hook/SpinnerContext';

const Spinner = () => {
  const { loading } = useSpinner();
  if (!loading) return null;

  return (
    <div className="spinner-overlay">
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner;