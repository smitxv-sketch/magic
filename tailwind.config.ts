import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Поверхности
        'surface':          '#FFFFFF',
        'surface-elevated': '#F7F8FA',
        'background':       '#EEF2F7',

        // Бренд
        'primary':          '#1A56DB',
        'primary-dark':     '#1E3A5F',
        'primary-light':    '#EBF4FF',

        // Текст
        'text-primary':     '#1A202C',
        'text-secondary':   '#4A5568',
        'text-muted':       '#718096',

        // Границы
        'border-default':   '#E2E8F0',
        'border-focus':     '#1A56DB',

        // Статусы
        'status-success-bg':    '#C6F6D5',
        'status-success-text':  '#276749',
        'status-success-border':'#9AE6B4',

        'status-warn-bg':       '#FEFCBF',
        'status-warn-text':     '#744210',
        'status-warn-border':   '#F6E05E',

        'status-danger-bg':     '#FED7D7',
        'status-danger-text':   '#C53030',
        'status-danger-border': '#FC8181',

        // AI-нода (особый стиль)
        'ai-node-bg':       '#EBF4FF',
        'ai-node-border':   '#1A56DB',
        'ai-node-glow':     '#93C5FD',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'modal': '0 20px 60px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 4px 20px rgba(26, 86, 219, 0.12)',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 1.5s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
