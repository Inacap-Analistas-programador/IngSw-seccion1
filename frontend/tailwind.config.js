/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        scout: {
          'azul-oscuro': '#1f4e79',
          'azul-medio': '#3b82f6',
          'azul-claro': '#8b9dc3',
          'azul-muy-claro': '#dbe7fd',
          'verde-natura': '#22c55e',
          'dorado-aventura': '#f59e0b',
          'rojo-alerta': '#ef4444',
          'gris-neutro': '#6b7280',
        }
      },
      fontFamily: {
        'scout': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'heading': ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'scout': '0 4px 20px rgba(31, 78, 121, 0.15)',
        'hover-scout': '0 8px 30px rgba(31, 78, 121, 0.25)',
      }
    },
  },
  plugins: [],
}