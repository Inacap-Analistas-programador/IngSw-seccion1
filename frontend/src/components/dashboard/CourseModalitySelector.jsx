import React from 'react';
import { Label } from '@/components/ui/Label';

const CourseModalitySelector = ({ value, onChange, error }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor="modalidad">Modalidad *</Label>
            <select
                id="modalidad"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500' : 'border-input'
                    }`}
            >
                <option value="">Seleccionar modalidad</option>
                <option value="presencial">Presencial</option>
                <option value="online">Online</option>
                <option value="hibrido">Híbrido</option>
            </select>
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
};

export default CourseModalitySelector;
