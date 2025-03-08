describe('IT Job Management App', () => {
  it('should load the homepage', () => {
      cy.visit('http://localhost:3001'); // Adjust if needed
      cy.contains('IT Job Management App').should('be.visible');
  });
});
