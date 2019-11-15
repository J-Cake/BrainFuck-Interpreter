"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class Tab {
    constructor(name, content) {
        this.tabContainer = utils_1.$(".tab-container");
        this.tabName = name;
        this.content = content;
    }
    createTab(tabTitle, icon) {
        // render the initial tab header and content
        const header = Tab.header;
        header.replace("$icon", `<span class="icon-character">${icon}</span>`);
        header.replace("$title", `<span class="title">${tabTitle}</span>`);
        const tabHeader = new DOMParser().parseFromString(header, "text/html");
    }
    setVisibility(isVisible) {
        this.content.style.display = isVisible ? "block" : "none";
    }
}
Tab.header = `<div class="tab">
        <div class="tab-icon">$icon</div>
        <div class="tab-title">$title</div>
        <div class="saved isSaved"></div>
        <div class="close-tab-btn"></div>
    </div>`;
exports.default = Tab;
//# sourceMappingURL=tab.js.map