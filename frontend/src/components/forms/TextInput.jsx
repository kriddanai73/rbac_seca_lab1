import React from 'react';

const TextInput = ({ label, name, value, onChange, type = 'text', placeholder, disabled, required, readOnly }) => {
  return (
    <div className="form-group">
      <label className="form-label">{label} {required && <span style={{color: 'var(--error-color)'}}>*</span>}</label>
      <input
        type={type}
        name={name}
        id={name}
        className="form-input"
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
      />
    </div>
  );
};

export default TextInput;
