import React from 'react';

const Card = ({ children, className = '', ...rest }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`} {...rest}>
    {children}
  </div>
);

export default Card;
