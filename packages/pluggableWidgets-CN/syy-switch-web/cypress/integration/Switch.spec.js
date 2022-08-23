describe("Switch", () => {
    // const cleanMendixSession = () => {
    //     cy.window().then(window => {
    //         // Cypress opens a new session for every test, so it exceeds mendix license limit of 5 sessions, we need to logout after each test.
    //         window.mx.session.logout();
    //     });
    // };

    beforeEach(() => {
        cy.visit("/"); // resets page
    });

    // afterEach(() => cleanMendixSession());
    it("default style with false", () => {
        cy.wait(2000);
        cy.get(".mx-name-sYYSwitchWeb2").should("be.visible");
        cy.get(".mx-name-sYYSwitchWeb2 div .ant-switch").should("have.css", "background-color", "rgba(0, 0, 0, 0.25)");
    });

    it("changes color when checked", () => {
        cy.wait(2000);
        cy.get(".mx-name-sYYSwitchWeb1").should("be.visible");
        cy.get(".mx-name-sYYSwitchWeb1 div .ant-switch-checked").should(
            "have.css",
            "background-color",
            "rgb(24, 144, 255)"
        );
    });

    it("updates attribute when clicked and it is disable ", () => {
        cy.wait(2000);
        cy.get(".mx-name-sYYSwitchWeb2").should("be.visible");
        cy.get(".mx-name-sYYSwitchWeb2").first().click();
        cy.get(".mx-name-sYYSwitchWeb2 div .ant-switch").invoke("attr", "aria-checked").should("eq", "false");
    });

    it("donot update attribute when clicked and it is disable and checked", () => {
        cy.wait(2000);
        cy.get(".mx-name-sYYSwitchWeb3").should("be.visible");
        cy.get(".mx-name-sYYSwitchWeb3").first().click();
        cy.get(".mx-name-sYYSwitchWeb3 div .ant-switch")
            .invoke("attr", "class")
            .should("contain", "ant-switch-checked");
        cy.get(".mx-name-sYYSwitchWeb3 div .ant-switch").invoke("attr", "aria-checked").should("eq", "true");
    });

    it("when size is small", () => {
        cy.wait(2000);
        cy.get(".mx-name-sYYSwitchWeb5").should("be.visible");
        cy.get(".mx-name-sYYSwitchWeb5 div .ant-switch").should("have.class", "ant-switch-small");
    });

    it("onName is 'On' and offName is 'Off'", () => {
        cy.wait(2000);
        cy.get(".mx-name-sYYSwitchWeb7").should("be.visible");
        cy.get(".mx-name-sYYSwitchWeb7 div .ant-switch")
            .should("have.class", "ant-switch-checked")
            .get(".ant-switch-inner")
            .should("have.text", "On");
        cy.get(".mx-name-sYYSwitchWeb7 .ant-switch")
            .first()
            .click()
            .wait(1000)
            .find(".ant-switch-inner")
            .should("have.text", "Off");
    });
});
