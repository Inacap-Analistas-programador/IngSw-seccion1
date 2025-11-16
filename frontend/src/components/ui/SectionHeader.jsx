import React from 'react';

const SectionHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center space-x-2">{actions}</div>
    </div>
  );
};

export default SectionHeader;
