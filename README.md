# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh



# Setting Up and Using Cypress with React.js

## Initial Setup

1. First, install Cypress and the required dependencies:

```bash
# Install Cypress and Component Testing dependencies
npm install -D cypress @cypress/react @cypress/webpack-dev-server

# For TypeScript support (optional)
npm install -D @types/cypress
```

2. Initialize Cypress in your project:

```bash
npx cypress open
```

## Project Configuration

1. Create or update `cypress.config.js`:

```javascript
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
  },
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: 'http://localhost:3000',
  },
})
```

2. Create a support file `cypress/support/component.js`:

```javascript
import './commands'
import { mount } from '@cypress/react'

Cypress.Commands.add('mount', mount)
```

## Writing Component Tests

Here's an example structure for testing a Button component:

1. Create your component (`Button.jsx`):

```jsx
// src/components/Button.jsx
import React from 'react'

const Button = ({ label, onClick }) => {
  return (
    <button 
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default Button
```

2. Create the test file (`Button.cy.jsx`):

```jsx
// cypress/component/Button.cy.jsx
import React from 'react'
import Button from '../../src/components/Button'

describe('Button Component', () => {
  it('renders with correct label', () => {
    cy.mount(<Button label="Click me" />)
    cy.get('button').should('have.text', 'Click me')
  })

  it('handles click events', () => {
    const onClick = cy.stub().as('clickHandler')
    cy.mount(<Button label="Click me" onClick={onClick} />)
    
    cy.get('button').click()
    cy.get('@clickHandler').should('have.been.calledOnce')
  })

  it('has correct styles', () => {
    cy.mount(<Button label="Click me" />)
    cy.get('button')
      .should('have.class', 'bg-blue-500')
      .and('have.class', 'text-white')
  })
})
```

## Testing More Complex Components

Here's an example of testing a form component with async operations:

```jsx
// Form.jsx
import React, { useState } from 'react'

const Form = ({ onSubmit }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        data-cy="email-input"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        data-cy="password-input"
      />
      <button type="submit" data-cy="submit-button">
        Submit
      </button>
    </form>
  )
}

// Form.cy.jsx
describe('Form Component', () => {
  it('submits form data correctly', () => {
    const onSubmit = cy.stub().resolves()
    
    cy.mount(<Form onSubmit={onSubmit} />)
    
    cy.get('[data-cy=email-input]').type('test@example.com')
    cy.get('[data-cy=password-input]').type('password123')
    cy.get('[data-cy=submit-button]').click()
    
    cy.wrap(onSubmit).should('have.been.calledWith', {
      email: 'test@example.com',
      password: 'password123'
    })
  })

  it('handles form validation', () => {
    cy.mount(<Form onSubmit={cy.stub()} />)
    
    cy.get('[data-cy=submit-button]').click()
    cy.get('[data-cy=email-input]:invalid').should('exist')
  })
})
```

## Best Practices

1. Use data-cy attributes for test selectors:
```jsx
<button data-cy="submit-button">Submit</button>
```

2. Test component isolation:
```jsx
// Mock child components when testing parent
const MockChild = () => <div data-cy="mock-child">Mock Child</div>
cy.stub(ChildComponent).returns(<MockChild />)
```

3. Test async operations:
```javascript
it('handles async operations', () => {
  cy.intercept('POST', '/api/submit', {
    statusCode: 200,
    body: { success: true }
  }).as('submitForm')

  cy.mount(<Form />)
  // ... fill form
  cy.get('[data-cy=submit-button]').click()
  cy.wait('@submitForm')
})
```

4. Group related tests:
```javascript
describe('Form Component', () => {
  describe('Validation', () => {
    it('validates email format')
    it('validates required fields')
  })

  describe('Submission', () => {
    it('handles successful submit')
    it('handles submission errors')
  })
})
```

## Common Commands and Assertions

```javascript
// Selecting elements
cy.get('[data-cy=button]')
cy.contains('Submit')

// Interactions
cy.get('input').type('Hello')
cy.get('button').click()
cy.get('select').select('option1')

// Assertions
cy.get('.error').should('be.visible')
cy.get('button').should('be.disabled')
cy.get('input').should('have.value', 'Hello')

// Waiting
cy.wait('@apiCall')
cy.wait(1000) // Wait for 1 second
```