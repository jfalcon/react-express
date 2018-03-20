import React from 'react';
import './header.scss';

// props is always passed to stateless functional components, but here we use the destructuring
// assignment syntax in the parameter list to explode the values in props into direct variables
const Header = () => {
   return (
    <header>
      Welecome Messages
    </header>
   );
};

export default Header;
