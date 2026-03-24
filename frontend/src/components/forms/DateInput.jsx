import React from 'react';

const DateInput = ({ label, name, value, onChange, disabled, required }) => {
  return (
    <div className="form-group">
      <label className="form-label">{label} {required && <span style={{color: 'var(--error-color)'}}>*</span>}</label>
      <input
        type="date"
        name={name}
        id={name}
        className="form-input"
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        required={required}
      />
    </div>
  );
};

export default DateInput;
