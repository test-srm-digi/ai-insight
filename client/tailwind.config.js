/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // DigiCert Blue palette
        'dc-blue': {
          50: '#E6F3FF',
          100: '#CCE7FF',
          200: '#99CFFF',
          300: '#66B7FF',
          400: '#339FFF',
          500: '#0078D4', // Primary blue
          600: '#005A9E',
          700: '#003F6F',
          800: '#002A4A',
          900: '#001525',
        },
        // DigiCert Gray palette
        'dc-gray': {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Severity colors
        'severity': {
          critical: '#B63A21',
          high: '#F95738',
          medium: '#F8CB5D',
          low: '#22c55e',
          info: '#0174C3',
        },
        // Legacy colors (keep for backward compatibility)
        'rsi-primary': '#0078D4',
        'rsi-secondary': '#005A9E',
        'risk-critical': '#B63A21',
        'risk-high': '#F95738',
        'risk-medium': '#F8CB5D',
        'risk-low': '#22c55e',
        'risk-info': '#0174C3',
      },
    },
  },
  plugins: [],
}

