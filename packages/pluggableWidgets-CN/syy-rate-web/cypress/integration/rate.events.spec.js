describe("RateWeb events", () => {
    it("default RateWeb events", () => {
        cy.visit("/");
        cy.wait(2000);
        cy.get(".default-rate .ant-rate-star-full").should("have.length", 5);
        cy.get(".default-rate .ant-rate-star-first").eq(3).click();
        cy.get(".default-rate .ant-rate-star-full").should("have.length", 4);
        cy.get(".default-rate .ant-rate-star-half").should("not.exist");
    });

    it("allowClear RateWeb events", () => {
        cy.get(".allowClear-rate .ant-rate-star-full").should("have.length", 3);
        cy.get(".allowClear-rate .ant-rate-star-first").eq(2).click();
        cy.get(".allowClear-rate .ant-rate-star-full").should("not.exist");
        cy.get(".allowClear-rate .ant-rate-star-half").should("not.exist");
        cy.get(".allowClear-rate .ant-rate-star-first").eq(4).click();
        cy.get(".allowClear-rate .ant-rate-star-full").should("have.length", 5);
        cy.get(".allowClear-rate .ant-rate-star-half").should("not.exist");
    });

    it("disabled RateWeb events", () => {
        cy.get(".disabled-rate .ant-rate-star-full").should("have.length", 3);
        cy.get(".disabled-rate .ant-rate-star-first").eq(1).click();
        cy.get(".disabled-rate .ant-rate-star-full").should("have.length", 3);
        cy.get(".disabled-rate .ant-rate-star-half").should("not.exist");
        cy.get(".disabled-rate .ant-rate-star-second").eq(4).click();
        cy.get(".disabled-rate .ant-rate-star-full").should("have.length", 3);
        cy.get(".disabled-rate .ant-rate-star-half").should("not.exist");
    });

    it("allowHalf RateWeb events", () => {
        cy.get(".allow-half .ant-rate-star-first").eq(1).click();
        cy.get(".allow-half .ant-rate-star-full").should("have.length", 1);
        cy.get(".allow-half .ant-rate-star-half").should("have.length", 1);
        cy.get(".allow-half .ant-rate-star-second").eq(4).click();
        cy.get(".allow-half .ant-rate-star-full").should("have.length", 5);
        cy.get(".allow-half .ant-rate-star-half").should("not.exist");
    });
});
