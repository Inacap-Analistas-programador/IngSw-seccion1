import React from 'react';
import { Label } from '@/components/ui/Label';

const CourseTypeSelector = ({ value, onChange, error }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor="tipoCurso">Tipo de Curso *</Label>
            <select
                id="tipoCurso"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500' : 'border-input'
                    }`}
            >
                <option value="">Seleccionar tipo</option>
                <option value="inicial">Inicial</option>
                <option value="medio">Medio</option>
                <option value="avanzado">Avanzado</option>
            </select>
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
};

export default CourseTypeSelector;
