import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite', // Using Vite directly as the bundler
    },
    specPattern: 'src/components/**/*.cy.{js,jsx,ts,tsx}',
  },
 
});
