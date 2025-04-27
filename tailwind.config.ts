import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				gameshow: {
					primary: '#9b30ff',
					secondary: '#6e00ff',
					accent: '#ff3c78',
					background: '#1a0533',
					card: '#2d1052',
					text: '#ffffff',
					muted: '#9d88c0'
				},
				neon: {
          blue: '#2E9CCA',
          purple: '#9D4EDD',
          pink: '#FF3864',
          orange: '#FF6B35',
          green: '#39FF14',
          red: '#FF2957',
          yellow: '#FFD700',
        },
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 12px #9b30ff',
						opacity: '1'
					},
					'50%': { 
						boxShadow: '0 0 20px #9b30ff',
						opacity: '0.8'
					}
				},
				'card-flip': {
					'0%': { 
						transform: 'rotateY(0deg)',
					},
					'100%': { 
						transform: 'rotateY(180deg)',
					}
				},
				'card-flash': {
					'0%': { 
						opacity: '0.3',
					},
					'50%': { 
						opacity: '1',
					},
					'100%': { 
						opacity: '0.3',
					}
				},
				'wheel-spin': {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'100%': {
						transform: 'rotate(360deg)'
					}
				},
				'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(46, 156, 202, 0.5), 0 0 20px rgba(46, 156, 202, 0.3)',
            opacity: '1'
          },
          '50%': {
            boxShadow: '0 0 10px rgba(46, 156, 202, 0.8), 0 0 30px rgba(46, 156, 202, 0.6)',
            opacity: '0.8'
          }
        },
        'neon-pulse': {
          '0%, 100%': {
            textShadow: '0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px #2E9CCA, 0 0 80px #2E9CCA'
          },
          '50%': {
            textShadow: '0 0 4px #fff, 0 0 9px #fff, 0 0 15px #fff, 0 0 30px #2E9CCA, 0 0 60px #2E9CCA'
          }
        },
        'fade-in': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-out': {
          '0%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(10px)'
          }
        },
        'bounce': {
          '0%, 100%': {
            transform: 'translateY(-10%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          }
        },
        'confetti': {
          '0%': { 
            transform: 'translateY(0) rotate(0deg)',
            opacity: '1'
          },
          '100%': {
            transform: 'translateY(100vh) rotate(720deg)',
            opacity: '0'
          }
        },
        'marquee': {
          '0%': {
            transform: 'translateX(100%)'
          },
          '100%': {
            transform: 'translateX(-100%)'
          }
        },
        'fast-pulse': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 15px rgba(255, 56, 100, 0.7), 0 0 30px rgba(255, 56, 100, 0.5)'
          },
          '50%': {
            opacity: '0.8',
            boxShadow: '0 0 25px rgba(255, 56, 100, 0.9), 0 0 40px rgba(255, 56, 100, 0.7)'
          }
        },
        'pulse-logo': {
          '0%, 100%': { 
            transform: 'scale(1)',
            boxShadow: '0 0 10px #9D4EDD, 0 0 20px rgba(157, 78, 221, 0.5)'
          },
          '50%': { 
            transform: 'scale(1.05)',
            boxShadow: '0 0 15px #9D4EDD, 0 0 25px rgba(157, 78, 221, 0.7)'
          }
        },
        'timer-pulse': {
          '0%, 100%': { 
            opacity: '1',
            boxShadow: '0 0 10px rgba(255, 56, 100, 0.5), 0 0 20px rgba(255, 56, 100, 0.3)'
          },
          '50%': { 
            opacity: '0.8',
            boxShadow: '0 0 15px rgba(255, 56, 100, 0.7), 0 0 25px rgba(255, 56, 100, 0.5)'
          }
        }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'card-flip': 'card-flip 0.5s ease-out forwards',
				'card-flash': 'card-flash 0.8s ease-in-out',
				'wheel-spin': 'wheel-spin 5s cubic-bezier(0.3, 0.8, 0.2, 1) forwards',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'neon-pulse': 'neon-pulse 1.5s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        'bounce': 'bounce 1s infinite',
        'confetti': 'confetti 2s cubic-bezier(0, 0.5, 0.5, 1) forwards',
        'marquee': 'marquee 20s linear infinite',
        'fast-pulse': 'fast-pulse 0.5s infinite',
        'pulse-logo': 'pulse-logo 2s infinite',
        'timer-pulse': 'timer-pulse 0.5s infinite'
			},
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, rgba(46, 156, 202, 0.8), rgba(157, 78, 221, 0.8))',
        'gradient-glow': 'radial-gradient(circle, rgba(57, 255, 20, 0.3) 0%, rgba(46, 156, 202, 0.3) 100%)',
      },
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
