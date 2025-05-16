import React from 'react';

const TextInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  ...props
}) => {
  return (
    <div className="mb-4">

      <input
        required
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
        className={`
          w-full placeholder-white tracking-wide px-3 py-2 border-b outline-none bg-transparent  
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-white'}
        `}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default TextInput;