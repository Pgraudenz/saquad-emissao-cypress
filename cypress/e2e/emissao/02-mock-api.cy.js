describe("Mock de API", () => {

  beforeEach(() => {
    cy.intercept("POST", "**/api/biometria/validar*", {
      statusCode: 200,
      body: {
        status: "APROVADA"
      }
    }).as("biometria");
  });

  it("teste 1", () => {
    cy.request("POST", "http://localhost:3333/api/biometria/validar");
  });

  it("teste 2", () => {
    cy.request("POST", "http://localhost:3333/api/biometria/validar");
  });

});