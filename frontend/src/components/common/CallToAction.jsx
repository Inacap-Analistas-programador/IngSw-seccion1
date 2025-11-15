import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CallToAction = ({
  title,
  description,
  buttonText = 'Comenzar',
  href = '/preinscripcion',
  variant = 'primary',
}) => {
  const bgColor = variant === 'primary' ? 'bg-scout-azul-oscuro' : 'bg-scout-verde-natura';

  return (
    <section className={`${bgColor} text-white py-16 px-4`}>
      <div className="container mx-auto max-w-4xl text-center">
        {title && <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>}
        {description && <p className="text-lg md:text-xl mb-8 opacity-90">{description}</p>}
        <Link
          to={href}
          className="inline-flex items-center gap-2 bg-white text-scout-azul-oscuro px-8 py-3 rounded-lg font-semibold hover:shadow-hover-scout transition-all transform hover:scale-105"
        >
          {buttonText}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
