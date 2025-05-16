'use client'
import React, { useState } from 'react';
import Loader from '../Loader';

const Button = ({
  label,
  onClick,
  variant,
  disabled = false,
  className = '',
  loader
}) => {
  const [isLoading, setIsLoading] = useState(loader);



  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-black hover:bg-white hover:text-black text-white';
      case 'secondary':
        return 'bg-white hover:bg-black text-black hover:text-white';
      case 'tertiary':
        return 'bg-orange-500 hover:bg-orange-600 text-white ';
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white';
    }
  };

  return (
    <button
      onClick={(e) => {
        setIsLoading(true);
        onClick(e);
      }}
      disabled={disabled || isLoading}
      className={`h-12 lg:py-3 flex-nowrap items-center justify-center flex min-w-48 lg:min-w-48 w-full font-bold rounded-full text-sm lg:text- transition-colors duration-300 ${getButtonStyles()} ${className}`}
    >
      {isLoading ? (
        <Loader />
      ) : (
        label
      )}
    </button>

  );
};

export default Button;
