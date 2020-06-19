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
exports.getBalance = exports.getAccountInfo = exports.createAccount = exports.MOSAIC_NAME = exports.NETWORKTYPE = void 0;
const symbol_sdk_1 = require("symbol-sdk");
const readline_sync_1 = __importDefault(require("readline-sync"));
const storage_1 = require("./storage");
const crypto_1 = require("./crypto");
exports.NETWORKTYPE = symbol_sdk_1.NetworkType.TEST_NET;
exports.MOSAIC_NAME = 'covidcoins';
const HELP = 'martina.canonaco98@gmail.com or alihbek@outlook.com';
const MOSAIC_ID_COVIDCOIN = '79D507A2D44B9923';
//const nodeUrl = 'http://api-01.eu-central-1.testnet-0951-v1.symboldev.network:3000-api-01-eu-central-1';
const nodeUrl = 'http://api-01.eu-central-1.testnet-0951-v1.symboldev.network:3000';
const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
const accountHttp = repositoryFactory.createAccountRepository();
function createAccount() {
    console.log('\nPlease enter a unique password (at least 8 character).\n');
    let inputPassword = readline_sync_1.default.questionNewPassword('Input a Password: ', { min: 8, max: 16 });
    const password = new symbol_sdk_1.Password(inputPassword);
    let walletName = readline_sync_1.default.question('\nGive to the wallet a name: ');
    const pvtKey = crypto_1.generateMnemonicPrivateKey();
    const wallet = symbol_sdk_1.SimpleWallet.createFromPrivateKey(walletName, password, pvtKey, exports.NETWORKTYPE);
    const secret = {
        password: password,
        privateKey: pvtKey,
        walletName: walletName,
    };
    console.log(`A new wallet is generated with the address: ${wallet.address.pretty()}`);
    console.log(`\nNow you can start to send and receive ${exports.MOSAIC_NAME}!\n`);
    storage_1.storeSecrets(secret);
}
exports.createAccount = createAccount;
function getAccountInfo(address) {
    return __awaiter(this, void 0, void 0, function* () {
        //make the request to the http
        accountHttp.getAccountInfo(address).subscribe((accountInfo) => console.log(accountInfo));
        return true;
    });
}
exports.getAccountInfo = getAccountInfo;
function getBalance(address) {
    return __awaiter(this, void 0, void 0, function* () {
        //make the request to the http
        accountHttp.getAccountInfo(address).subscribe((accountInfo) => {
            console.log(accountInfo);
            let mosaics = accountInfo.mosaics;
            let mosaic = mosaics.find((mosaic) => mosaic.id.toHex() == MOSAIC_ID_COVIDCOIN);
            if (mosaic) {
                console.log(`\nYou have ${mosaic.amount.toString()} ${exports.MOSAIC_NAME} in your wallet.`);
            }
            else {
                console.log(`\nYou have 0 ${exports.MOSAIC_NAME} in your balance.`);
                console.log(`\nYou could ask to ${HELP} for some ${exports.MOSAIC_NAME}`);
            }
        }),
            (err) => {
                console.log(`An error was happening and it was not possible to check the balance ${err}`);
            };
        return true;
    });
}
exports.getBalance = getBalance;
