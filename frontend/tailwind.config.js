  /** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html",
    ],
    theme: {
      extend: {
        colors: {
          // Custom brand colors
          brand: {
            50: '#eff6ff',
            100: '#dbeafe', 
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
          },
          // Severity colors
          severity: {
            critical: {
              50: '#fef2f2',
              100: '#fee2e2',
              500: '#ef4444',
              600: '#dc2626',
              700: '#b91c1c',
            },
            high: {
              50: '#fff7ed',
              100: '#ffedd5', 
              500: '#f97316',
              600: '#ea580c',
              700: '#c2410c',
            },
            medium: {
              50: '#fffbeb',
              100: '#fef3c7',
              500: '#f59e0b', 
              600: '#d97706',
              700: '#b45309',
            },
            low: {
              50: '#eff6ff',
              100: '#dbeafe',
              500: '#3b82f6',
              600: '#2563eb', 
              700: '#1d4ed8',
            },
            info: {
              50: '#f9fafb',
              100: '#f3f4f6',
              500: '#6b7280',
              600: '#4b5563',
              700: '#374151',
            }
          }
        },
        fontFamily: {
          sans: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Roboto',
            'Helvetica Neue', 
            'Arial',
            'sans-serif',
          ],
          mono: [
            'JetBrains Mono',
            'Monaco',
            'Cascadia Code', 
            'Segoe UI Mono',
            'Roboto Mono',
            'monospace',
          ],
        },
        fontSize: {
          '2xs': '0.625rem',
          '3xl': '1.953125rem',
          '4xl': '2.44140625rem', 
          '5xl': '3.0517578125rem',
        },
        spacing: {
          '18': '4.5rem',
          '88': '22rem', 
          '128': '32rem',
          '144': '36rem',
        },
        maxWidth: {
          '8xl': '88rem',
          '9xl': '96rem',
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-out',
          'slide-in': 'slideIn 0.3s ease-out',
          'slide-up': 'slideUp 0.3s ease-out',
          'bounce-subtle': 'bounceSubtle 2s infinite',
          'pulse-slow': 'pulse 3s infinite',
          'spin-slow': 'spin 3s linear infinite',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          slideIn: {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(0)' },
          },
          slideUp: {
            '0%': { transform: 'translateY(100%)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          bounceSubtle: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-5px)' },
          },
        },
        boxShadow: {
          'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.08)',
          'medium': '0 4px 25px 0 rgba(0, 0, 0, 0.1)', 
          'hard': '0 10px 40px 0 rgba(0, 0, 0, 0.15)',
          'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        },
        backdropBlur: {
          xs: '2px',
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        },
        screens: {
          'xs': '475px',
          '3xl': '1680px',
        },
      },
    },
    plugins: [
      // Custom plugin for vulnerability severity styles
      function({ addUtilities, theme }) {
        const severityUtilities = {
          '.severity-critical': {
            backgroundColor: theme('colors.severity.critical.50'),
            color: theme('colors.severity.critical.700'),
            borderColor: theme('colors.severity.critical.200'),
          },
          '.severity-high': {
            backgroundColor: theme('colors.severity.high.50'),
            color: theme('colors.severity.high.700'), 
            borderColor: theme('colors.severity.high.200'),
          },
          '.severity-medium': {
            backgroundColor: theme('colors.severity.medium.50'),
            color: theme('colors.severity.medium.700'),
            borderColor: theme('colors.severity.medium.200'),
          },
          '.severity-low': {
            backgroundColor: theme('colors.severity.low.50'),
            color: theme('colors.severity.low.700'),
            borderColor: theme('colors.severity.low.200'),
          },
          '.severity-info': {
            backgroundColor: theme('colors.severity.info.50'),
            color: theme('colors.severity.info.700'),
            borderColor: theme('colors.severity.info.200'),
          },
        };
        
        addUtilities(severityUtilities);
      },
      
      // Custom plugin for glassmorphism effects
      function({ addUtilities }) {
        const glassUtilities = {
          '.glass': {
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          },
          '.glass-dark': {
            background: 'rgba(0, 0, 0, 0.25)', 
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        };
        
        addUtilities(glassUtilities);
      }
    ],
    
    // Safelist important classes that might be generated dynamically
    safelist: [
      'bg-red-50',
      'bg-orange-50', 
      'bg-yellow-50',
      'bg-blue-50',
      'bg-gray-50',
      'text-red-600',
      'text-orange-600',
      'text-yellow-600', 
      'text-blue-600',
      'text-gray-600',
      'border-red-200',
      'border-orange-200',
      'border-yellow-200',
      'border-blue-200', 
      'border-gray-200',
      'severity-critical',
      'severity-high',
      'severity-medium',
      'severity-low',
      'severity-info',
    ],
  }