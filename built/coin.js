"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
class Coin {
    constructor(value) {
        this.address = (Math.random() * 1e64).toString(36);
        this.value = value;
    }
}
exports.default = Coin;
