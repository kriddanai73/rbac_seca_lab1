import React from 'react';

const CheckboxGroup = ({ label, name, options, value, onChange }) => {
  // Value should be an array of selected options
  const handleChange = (e) => {
    const optionValue = e.target.value;
    const isChecked = e.target.checked;
    
    let newValue = [...(value || [])];
    if (isChecked) {
      newValue.push(optionValue);
    } else {
      newValue = newValue.filter(v => v !== optionValue);
    }
    
    onChange({ target: { name, value: newValue } });
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="checkbox-group">
        {options.map((option) => (
          <label key={option.value} className="checkbox-item">
            <input
              type="checkbox"
              name={`${name}[]`}
              value={option.value}
              checked={(value || []).includes(option.value)}
              onChange={handleChange}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
