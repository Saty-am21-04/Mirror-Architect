/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vscode-bg' : 'var(--vscode-sideBar-background)',
        'vscode-fg' : 'var(--vscode-sideBar-foreground)',
        'vscode-accent' : 'var(--vscode-button-background)',
      },
    },
  },
  plugins: [],
}

