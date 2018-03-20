import React from 'react';
import PropTypes from 'prop-types';

// props is always passed to stateless functional components, but here we use the destructuring
// assignment syntax in the parameter list to explode the values in props into direct variables
const TextInput = ({ onChange, name, isDisabled, value, label, placeholder, errorMessage }) => {
  let inputError = (errorMessage && (errorMessage.length > 0)) ? errorMessage : '';
  let inputLabel = (label && (label.length > 0)) ? label : '';
  let inputName = (name && (name.length > 0)) ? name : '';
  let inputPlaceholder = (placeholder && (placeholder.length > 0)) ? placeholder : '';
  let inputValue = (value && (value.length > 0)) ? value : '';

  // always do a two pass sanitation of string input
  inputError = inputError.trim();
  inputLabel = inputLabel.trim();
  inputName = inputName.trim();
  inputPlaceholder = inputPlaceholder.trim();
  inputValue = inputValue.trim();

  let wrapperClass = (inputError.length > 0) ? 'form-group has-error' : 'form-group';

  // always specify the attributes this way to give us greater control over the output
  const attributes = {
    type: 'text',
    id: inputName,
    name: inputName,
    onChange: onChange,
    disabled: isDisabled
  };

  // do not inject these attributes if null data was passed in
  if (inputPlaceholder) attributes.placeholder = inputPlaceholder;
  if (inputValue) attributes.value = inputValue;

  return (
    <div className={wrapperClass}>
      {inputLabel && <label htmlFor={inputName}>{inputLabel}</label>}
      <div className="field">
        <input
          type="text"
          id={name}
          name={name}
          className="form-control"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {inputError && <div className="alert alert-danger">{inputError}</div>}
      </div>
    </div>
  );
};

// this has to be separate for stateless functional components
TextInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  value: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  errorMessage: PropTypes.string
};

export default TextInput;
