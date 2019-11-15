"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tab_1 = __importDefault(require("./tab"));
class TabManager {
    static newTab(content, name, icon) {
        const tab = new tab_1.default(name, content);
        tab.createTab(name, icon);
        this.tabs.push(tab);
    }
}
exports.default = TabManager;
//# sourceMappingURL=tabManager.js.map