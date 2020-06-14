"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadWallet = exports.storeSecrets = void 0;
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const symbol_sdk_1 = require("symbol-sdk");
const readline_sync_1 = __importDefault(require("readline-sync"));
const wallet_1 = require("./wallet");
function storeSecrets(secrets) {
    const PATH_HOME = `${os_1.default.homedir()}/${wallet_1.MOSAIC_NAME}-wallets`;
    const PATH_WALLET = `${PATH_HOME}/${wallet_1.MOSAIC_NAME}-wallet.enry`;
    if (!fs_1.default.existsSync(PATH_HOME)) {
        fs_1.default.mkdirSync(PATH_HOME);
    }
    let fullPath = PATH_WALLET;
    if (fs_1.default.existsSync(fullPath)) {
        const stamp = new Date().toISOString();
        fullPath = `${PATH_HOME}/${stamp}-${wallet_1.MOSAIC_NAME}-secrets.enry`;
    }
    fs_1.default.writeFileSync(fullPath, JSON.stringify(secrets));
    //how create these secrets?
    console.log(`Secrets stored! ${fullPath}`);
}
exports.storeSecrets = storeSecrets;
function loadWallet() {
    return __awaiter(this, void 0, void 0, function* () {
        const PATH_HOME = `${os_1.default.homedir()}/${wallet_1.MOSAIC_NAME}-wallets`;
        const PATH_WALLET = `${PATH_HOME}/${wallet_1.MOSAIC_NAME}-wallet.enry`;
        const text = fs_1.default.readFileSync(PATH_WALLET, 'utf8');
        const secrets = JSON.parse(text);
        //i want to keep things in a safer way
        const password = readline_sync_1.default.question('\nInput Password: ');
        //check if the passwords are corrisponding
        if (password != secrets.password.value) {
            console.log('\n Password provided is wrong!');
            loadWallet();
        }
        console.log('\nRight Password was provided!');
        //now i need to import wallet's infos
        const wallet = symbol_sdk_1.SimpleWallet.createFromPrivateKey(secrets.walletName, secrets.password, secrets.privateKey, wallet_1.NETWORKTYPE);
        console.log(`\nWallet Public Key is: ${wallet.address.pretty()}`);
        return wallet;
    });
}
exports.loadWallet = loadWallet;
