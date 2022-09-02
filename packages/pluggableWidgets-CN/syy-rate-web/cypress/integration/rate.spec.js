describe("RateWeb", () => {
    it("Displays a RateWeb whith full stars", () => {
        cy.visit("/");
        cy.wait(2000);
        cy.get(".full-star .ant-rate-star").should("have.class", "ant-rate-star-full");
    });

    it("Displays a RateWeb whith three stars", () => {
        cy.get(".three-star .ant-rate-star-full").should("have.length", 3);
    });

    it("Displays a RateWeb whith three and half stars", () => {
        cy.get(".three-and-half-star .ant-rate-star-full").should("have.length", 3);
        cy.get(".three-and-half-star .ant-rate-star-half").should("have.length", 1);
    });

    it("Displays a RateWeb whith ten stars", () => {
        cy.get(".count10 .ant-rate-star").should("have.length", 10);
    });

    it("Displays a RateWeb whith disabled", () => {
        cy.get(".disabled-rate .ant-rate").should("have.class", "ant-rate-disabled");
    });

    it("Displays a RateWeb whith a label", () => {
        cy.get(".show-label .control-label").contains("SYY Rate Web").should("exist");
    });
});
