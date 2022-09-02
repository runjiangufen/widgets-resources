describe("Collapse", () => {
    // beforeEach(()=>{
    //     cy.visit("/"); // resets page
    // })

    it("Displays a Collapse panel with a border", () => {
        cy.visit("/");
        cy.wait(2000);
        cy.get(".test-collapse-default-config")
            .should("have.class", "ant-collapse")
            // .should("not.have.class", "ant-collapse-borderless")
            .should("have.css", "border-top-width", "1px")
            .should("have.css", "border-left-width", "1px")
            .should("have.css", "border-right-width", "1px");
    });

    it("Displays a Collapse panel with no border", () => {
        cy.get(".test-collapse-not-default-config")
            .should("have.class", "ant-collapse-borderless")
            .should("have.css", "border-top-width", "0px")
            .should("have.css", "border-left-width", "0px")
            .should("have.css", "border-right-width", "0px")
            .should("have.css", "border-right-width", "0px");
    });

    it("Sets the Ghost property of the collapse panel to false", () => {
        cy.get(".test-collapse-default-config").should("have.not.class", "ant-collapse-ghost");
    });

    it("Sets the Ghost property of the collapse panel to true", () => {
        cy.get(".test-collapse-not-default-config")
            .should("have.class", "ant-collapse-ghost")
            .should("have.css", "background-color", "rgba(0, 0, 0, 0)");
    });

    it("Sets the expandIconPosition property of the collapse panel to start", () => {
        cy.get(".test-collapse-default-config").should("have.not.class", "ant-collapse-icon-position-end");
    });

    it("Sets the expandIconPosition property of the collapse panel to end", () => {
        cy.get(".test-collapse-not-default-config").should("have.class", "ant-collapse-icon-position-end");
    });

    it("Sets the collapsible property of the collapse panel to header", () => {
        cy.get(".test-collapse-default-config").should("have.not.class", "ant-collapse-item-disabled");
    });

    it("Sets the collapsible property of the collapse panel to disabled", () => {
        cy.get(".test-collapse-disabled-config .ant-collapse-item").should("have.class", "ant-collapse-item-disabled");
    });

    it("Sets the background-color property of the collapse panel to rgba(255, 0, 0)", () => {
        cy.get(".test-collapse-style").should("have.css", "background-color", "rgb(255, 0, 0)");
    });

    it("Sets the collapsible property of the collapse panel to disabled", () => {
        cy.get(".test-panel-style").should("have.css", "background-color", "rgb(255, 0, 0)");
    });

    it("Sets the collapsible property of the collapse panel to disabled", () => {
        cy.get(".test-panel-style").should("have.css", "background-color", "rgb(255, 0, 0)");
    });

    it("Sets the collapsible property of the panel to disabled", () => {
        cy.get(".test-panel .disable-panel").should("have.class", "ant-collapse-item-disabled");
    });

    it("Sets the forceRender property of the panel to true", () => {
        cy.get(".test-panel .show-dom .ant-collapse-content-box").contains("children2").should("exist");
    });

    it("Sets the forceRender property of the panel to false", () => {
        cy.get(".test-panel .not-show-arrow .ant-collapse-expand-icon").should("not.exist");
    });

    it("Sets the showArrow property of the panel to false", () => {
        cy.get(".test-panel .default-panel .ant-collapse-expand-icon").should("exist");
    });

    it("Sets the extra property of the panel to extra-text", () => {
        cy.get(".test-panel .test-panel-extra .ant-collapse-extra").contains("extra-text").should("exist");
    });
});
