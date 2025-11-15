import React from 'react';

const WelcomeMessage = ({ name, role, message, className = '' }) => {
  const defaultMessage = name ? `Bienvenido${role ? ` ${role}` : ''}, ${name}` : 'Bienvenido';

  return (
    <div className={`bg-scout-azul-muy-claro p-6 rounded-lg shadow-scout ${className}`}>
      <h2 className="text-2xl font-bold text-scout-azul-oscuro mb-2">{defaultMessage}</h2>
      {message && <p className="text-gray-700">{message}</p>}
    </div>
  );
};

export default WelcomeMessage;
