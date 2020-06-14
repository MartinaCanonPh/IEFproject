"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMnemonicPrivateKey = void 0;
var mnGen = require('mngen');
const hasha_1 = __importDefault(require("hasha"));
function sha256(word) {
    return hasha_1.default(word, { algorithm: 'sha256', encoding: 'hex' });
}
//I will use di function to create my wallet
function generateMnemonicPrivateKey() {
    const mnemonic = mnGen.list(4); //random strings ['home', 'bye', 'bike', 'pen']
    console.log(`Write down those mnemonic words that are used to generate your private key ${mnemonic}`);
    let hashes = [];
    mnemonic.map((word) => { hashes.push(sha256(word)); });
    let tmp_result1 = sha256(sha256(hashes[0]) + sha256(hashes[1]));
    let tmp_result2 = sha256(sha256(hashes[2]) + sha256(hashes[3]));
    let privateKey = sha256(sha256(tmp_result1) + sha256(tmp_result2));
    return privateKey;
}
exports.generateMnemonicPrivateKey = generateMnemonicPrivateKey;
