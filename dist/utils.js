"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
HTMLElement.prototype.$ = function (selector) {
    return this.querySelector(selector);
};
//@ts-ignore
HTMLElement.prototype._ = function (selector) {
    return [...this.querySelectorAll(selector)];
};
function $(selector) {
    return document.querySelector(selector);
}
exports.$ = $;
function _(selector) {
    return [...document.querySelectorAll(selector)];
}
exports._ = _;
//# sourceMappingURL=utils.js.map