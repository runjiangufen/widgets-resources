describe("Switch", () => {
    // const cleanMendixSession = () => {
    //     cy.window().then(window => {
    //         // Cypress opens a new session for every test, so it exceeds mendix license limit of 5 sessions, we need to logout after each test.
    //         window.mx.session.logout();
    //     });
    // };

    beforeEach(() => {
        cy.visit("/p/m"); // resets page
    });

    // afterEach(() => cleanMendixSession());

    it("opens popup when clicked", () => {
        cy.wait(2000);
        cy.get(".mx-name-sYYSwitchWeb1").should("be.visible");
        cy.get(".mx-name-sYYSwitchWeb1 .ant-switch").first().click();
        cy.get(".mx-name-switch1 .widget-switch-btn-wrapper").should("have.class", "checked");
        cy.wait(1000);
        cy.get(".ant-popover.ant-popconfirm .ant-popover-message-title")
            .should("be.visible")
            .and("contain.text", "close it ?");
    });

    it("opens popup when clicked and click cancel", () => {
        cy.wait(2000);
        cy.get(".mx-name-sYYSwitchWeb1").should("be.visible");
        cy.get(".mx-name-sYYSwitchWeb1 .ant-switch").first().click();
        cy.get(".mx-name-switch1 .widget-switch-btn-wrapper").should("have.class", "checked");
        cy.wait(1000);
        cy.get(".ant-popover.ant-popconfirm .ant-popover-message-title")
            .should("be.visible")
            .and("contain.text", "close it ?");
        cy.get(".ant-popover.ant-popconfirm .ant-popover-inner-content .ant-popover-buttons")
            .find(".ant-btn.ant-btn-default span")
            .should("have.text", "cancel")
            .click()
            .wait(1000)
            .get(".mx-name-switch1 .widget-switch-btn-wrapper")
            .should("have.class", "checked");
    });

    it("opens popup when clicked and click OK", () => {
        cy.wait(2000);
        cy.get(".mx-name-sYYSwitchWeb1").should("be.visible");
        cy.get(".mx-name-sYYSwitchWeb1 .ant-switch").first().click();
        cy.get(".mx-name-switch1 .widget-switch-btn-wrapper").should("have.class", "checked");
        cy.wait(1000);
        cy.get(".ant-popover.ant-popconfirm .ant-popover-message-title")
            .should("be.visible")
            .and("contain.text", "close it ?");
        cy.get(".ant-popover.ant-popconfirm .ant-popover-inner-content .ant-popover-buttons")
            .find(".ant-btn.ant-btn-primary span")
            .should("have.text", "OK")
            .click()
            .wait(1000)
            .get(".mx-name-switch1 .widget-switch-btn-wrapper")
            .should("have.not.class", "checked");
    });

    it("opens model when clicked", () => {
        cy.wait(2000);
        cy.get(".mx-name-sYYSwitchWeb2").should("be.visible");
        cy.get(".mx-name-sYYSwitchWeb2 .ant-switch").first().click();
        cy.get(".mx-name-switch2 .widget-switch-btn-wrapper").should("have.class", "checked");
        cy.wait(1000);
        cy.get(".ant-modal-content .ant-modal-confirm-title").should("be.visible").and("contain.text", "close it ?");
    });

    it("opens model when clicked and click cancel", () => {
        cy.wait(2000);
        cy.get(".mx-name-sYYSwitchWeb2").should("be.visible");
        cy.get(".mx-name-sYYSwitchWeb2 .ant-switch").first().click();
        cy.get(".mx-name-switch2 .widget-switch-btn-wrapper").should("have.class", "checked");
        cy.wait(1000);
        cy.get(".ant-modal-content .ant-modal-confirm-title").should("be.visible").and("contain.text", "close it ?");
        cy.get(".ant-modal-content .ant-modal-confirm-btns")
            .find(".ant-btn.ant-btn-default span")
            .should("have.text", "cancel")
            .click()
            .wait(1000)
            .get(".mx-name-switch2 .widget-switch-btn-wrapper")
            .should("have.class", "checked");
    });

    it("opens model when clicked and click ok", () => {
        cy.wait(2000);
        cy.get(".mx-name-sYYSwitchWeb2").should("be.visible");
        cy.get(".mx-name-sYYSwitchWeb2 .ant-switch").first().click();
        cy.get(".mx-name-switch2 .widget-switch-btn-wrapper").should("have.class", "checked");
        cy.wait(1000);
        cy.get(".ant-modal-content .ant-modal-confirm-title").should("be.visible").and("contain.text", "close it ?");
        cy.get(".ant-modal-content .ant-modal-confirm-btns")
            .find(".ant-btn.ant-btn-primary span")
            .should("have.text", "OK")
            .click()
            .wait(1000)
            .get(".mx-name-switch2 .widget-switch-btn-wrapper")
            .should("have.not.class", "checked");
    });
});
