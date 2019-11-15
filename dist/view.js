"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tabManager_1 = __importDefault(require("./tabManager"));
class View {
    static render() {
        const children = new DOMParser().parseFromString(this.template, "text/html").body;
        tabManager_1.default.newTab(children, this.viewName, this.icon);
    }
}
exports.default = View;
//# sourceMappingURL=view.js.map