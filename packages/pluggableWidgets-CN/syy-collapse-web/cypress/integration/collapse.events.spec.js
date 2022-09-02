describe("Collapse events", () => {
    it("accordion Modal", () => {
        cy.visit("/");
        cy.wait(2000);
        cy.get(".test-accordion .ant-collapse-header .ant-collapse-header-text").first().click();
        cy.get(".test-accordion .ant-collapse-content-active")
            .not(".ant-collapse-content-hidden")
            .should("have.length", 1);
        cy.get(".test-accordion .ant-collapse-item")
            .first()
            .should("have.class", "ant-collapse-item-active")
            .find(".ant-collapse-content-box")
            .should("be.visible");

        cy.get(".test-accordion .ant-collapse-header .ant-collapse-header-text").eq(1).click();
        cy.get(".test-accordion .ant-collapse-content-active")
            .not(".ant-collapse-content-hidden")
            .should("have.length", 1);
        cy.get(".test-accordion .ant-collapse-item")
            .eq(1)
            .should("have.class", "ant-collapse-item-active")
            .find(".ant-collapse-content-box")
            .should("be.visible");

        cy.get(".test-accordion .ant-collapse-header .ant-collapse-header-text").last().click();
        cy.get(".test-accordion .ant-collapse-content-active")
            .not(".ant-collapse-content-hidden")
            .should("have.length", 1);
        cy.get(".test-accordion .ant-collapse-item")
            .last()
            .should("have.class", "ant-collapse-item-active")
            .find(".ant-collapse-content-box")
            .should("be.visible");
    });

    it("default Modal", () => {
        cy.get(".test-collapse-default-config .ant-collapse-header .ant-collapse-header-text").first().click();
        cy.get(".test-collapse-default-config .ant-collapse-content-active")
            .not(".ant-collapse-content-hidden")
            .should("have.length", 1);
        cy.get(".test-collapse-default-config .ant-collapse-item")
            .first()
            .should("have.class", "ant-collapse-item-active")
            .find(".ant-collapse-content-box")
            .should("be.visible");

        cy.get(".test-collapse-default-config .ant-collapse-header .ant-collapse-header-text").eq(1).click();
        cy.get(".test-collapse-default-config .ant-collapse-content-active")
            .not(".ant-collapse-content-hidden")
            .should("have.length", 2);
        cy.get(".test-collapse-default-config .ant-collapse-item")
            .eq(1)
            .should("have.class", "ant-collapse-item-active")
            .find(".ant-collapse-content-box")
            .should("be.visible");

        cy.get(".test-collapse-default-config .ant-collapse-header .ant-collapse-header-text").last().click();
        cy.get(".test-collapse-default-config .ant-collapse-content-active")
            .not(".ant-collapse-content-hidden")
            .should("have.length", 3);
        cy.get(".test-collapse-default-config .ant-collapse-item")
            .last()
            .should("have.class", "ant-collapse-item-active")
            .find(".ant-collapse-content-box")
            .should("be.visible");

        cy.get(".test-collapse-default-config .ant-collapse-header .ant-collapse-header-text").last().click();
        cy.get(".test-collapse-default-config .ant-collapse-content-active")
            .not(".ant-collapse-content-hidden")
            .should("have.length", 2);
        cy.get(".test-collapse-default-config .ant-collapse-item")
            .last()
            .should("not.have.class", "ant-collapse-item-active")
            .find(".ant-collapse-content-box")
            .should("not.be.visible");

        cy.get(".test-collapse-default-config .ant-collapse-header .ant-collapse-header-text").eq(1).click();
        cy.get(".test-collapse-default-config .ant-collapse-content-active")
            .not(".ant-collapse-content-hidden")
            .should("have.length", 1);
        cy.get(".test-collapse-default-config .ant-collapse-item")
            .eq(1)
            .should("not.have.class", "ant-collapse-item-active")
            .find(".ant-collapse-content-box")
            .should("not.be.visible");

        cy.get(".test-collapse-default-config .ant-collapse-header .ant-collapse-header-text").first().click();
        cy.get(".test-collapse-default-config .ant-collapse-content-active").should("not.exist");
        cy.get(".test-collapse-default-config .ant-collapse-item")
            .first()
            .should("not.have.class", "ant-collapse-item-active")
            .find(".ant-collapse-content-box")
            .should("not.be.visible");
    });
});
