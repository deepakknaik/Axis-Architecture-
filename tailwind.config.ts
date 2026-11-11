import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        // Standard semantic tokens (shadcn/ui compatible)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // AXIS Architectural Warm Neutral Palette (Preserved 100%)
        axis: {
          bg: {
            DEFAULT: '#F8F6F1', // Primary architectural ivory
            subtle: '#F5F2EC',  // Off-white canvas
            canvas: '#F0ECE4',  // Slightly deeper neutral surface
            elevated: '#FCFAF7',// Top-level clean card surface
          },
          surface: {
            DEFAULT: '#EEEAE2', // Limestone surface
            hover: '#E8E3DA',   // Interactive hover stone
            active: '#E2DDD3',  // Pressed tone
            sunk: '#E4DFD5',    // Recessed area
            elevated: '#FCFAF7',// Raised panel
          },
          border: {
            DEFAULT: '#DDD8CE', // Subtle warm border
            subtle: '#E7E3DA',  // Hairline division
            strong: '#C5BFB2',  // Crisp technical delineation
            focus: '#B85D36',   // Focus indicator (terracotta)
          },
          text: {
            primary: '#252525',   // Soft charcoal
            secondary: '#6F6B63', // Warm slate gray
            muted: '#8E8980',     // Technical caption gray
            inverted: '#F8F6F1',  // Inverted ivory
          },
          accent: {
            DEFAULT: '#B85D36',  // Architectural Terracotta
            hover: '#A34F2B',
            active: '#8E4322',
            subtle: '#F6EFEB',
            foreground: '#FFFFFF',
            bronze: '#8F6E4A',
            bronzeSubtle: '#F3ECE3',
            sand: '#D5CABB',
          },
          grid: '#E2DCD1',
          gridSubtle: '#EBE5DC',
        },

        // Semantic Architectural Status Tokens
        status: {
          ready: {
            bg: '#EEF4EE',
            border: '#CADDC9',
            text: '#2D6137',
            dot: '#3E8C4D',
          },
          processing: {
            bg: '#EEF3F8',
            border: '#C7D8E8',
            text: '#275787',
            dot: '#3978B5',
          },
          analyzing: {
            bg: '#F5EEF9',
            border: '#DCBEEB',
            text: '#683690',
            dot: '#8E4EBE',
          },
          review: {
            bg: '#FDF6E8',
            border: '#F0DDB3',
            text: '#8B5B19',
            dot: '#B87B28',
          },
          verified: {
            bg: '#EAF4F1',
            border: '#BFDFD4',
            text: '#235F4E',
            dot: '#358A73',
          },
          generating: {
            bg: '#FAF0F6',
            border: '#ECC4DD',
            text: '#7D3363',
            dot: '#AA4889',
          },
          completed: {
            bg: '#EEF5ED',
            border: '#C5E2C7',
            text: '#256534',
            dot: '#37924C',
          },
          failed: {
            bg: '#F9ECEB',
            border: '#EEC2BF',
            text: '#8F2F28',
            dot: '#BD4138',
          },
        },
      },
      fontFamily: {
        sans: [
          'var(--font-sans)',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'var(--font-mono)',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'monospace',
        ],
      },
      boxShadow: {
        'axis-xs': '0 1px 2px 0 rgba(48, 44, 38, 0.04)',
        'axis-sm': '0 1px 3px 0 rgba(48, 44, 38, 0.06), 0 1px 2px -1px rgba(48, 44, 38, 0.04)',
        'axis-md': '0 4px 12px -2px rgba(48, 44, 38, 0.07), 0 2px 6px -2px rgba(48, 44, 38, 0.04)',
        'axis-lg': '0 12px 24px -4px rgba(48, 44, 38, 0.08), 0 4px 8px -3px rgba(48, 44, 38, 0.04)',
        'axis-elevated': '0 20px 32px -6px rgba(48, 44, 38, 0.10), 0 8px 12px -4px rgba(48, 44, 38, 0.05)',
        'axis-inset': 'inset 0 1px 2px 0 rgba(48, 44, 38, 0.06)',
      },
      borderRadius: {
        'axis-xs': '4px',
        'axis-sm': '6px',
        'axis-md': '8px',
        'axis-lg': '12px',
        'axis-xl': '16px',
      },
      backgroundImage: {
        'architectural-grid':
          'radial-gradient(#DDD8CE 1px, transparent 1px), radial-gradient(#DDD8CE 1px, #F8F6F1 1px)',
      },
    },
  },
  plugins: [],
};

export default config;
