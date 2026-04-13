describe("Emissão - Happy path", () => {
  it("deve acessar a página com sucesso", () => {
    cy.visit("https://example.cypress.io");
    cy.contains("type").click();
  });
});