import React from 'react';
import PropTypes from 'prop-types';

// props is always passed to stateless functional components, but here we use the destructuring
// assignment syntax in the parameter list to explode the values in props into direct variables
const SubmitInput = ({ onSubmit, innerHTML, isDisabled, name, className }) => {
  // TODO: localize this stuff
  let inputClass = (className && (className.length > 0)) ? className : 'btn';
  let inputName = (name && (name.length > 0)) ? name : '';
  let inputHTML = (innerHTML && (innerHTML.length > 0)) ? innerHTML : 'Submit';

  // always do a two pass sanitation of string input
  inputClass = inputClass.trim();
  inputName = inputName.trim();
  inputHTML = inputHTML.trim();

  // IE has a different default for the button tag so be explicit with the type attribute
  const attributes = {
    type: 'button',
    onClick: onSubmit,
    className: inputClass,
    disabled: isDisabled
  };

  // do not inject these attributes if null data was passed in
  if (inputName) {
    attributes.id = inputName;
    attributes.name = inputName;
  }

  // do not use input type="submit" so we can inject HTML
  return (
    <button {...attributes}>{inputHTML}</button>
  );
};

// this has to be separate for stateless functional components
SubmitInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  innerHTML: PropTypes.string,
  isDisabled: PropTypes.bool,
  name: PropTypes.string,
  className: PropTypes.string
};

export default SubmitInput;
