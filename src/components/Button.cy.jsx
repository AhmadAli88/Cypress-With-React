import MyButton from "./Button"

describe('Test button', () => {
  it('check working....', () => {
    cy.mount(<MyButton/>)
  })
})