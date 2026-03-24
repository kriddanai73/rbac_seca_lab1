import React from 'react';

const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'กรุณาเลือก'
}) => {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="form-input"
      >
        <option value="">{placeholder}</option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;