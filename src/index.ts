import readlineSync from 'readline-sync';
import {createAccount, getBalance, testTransaction} from './wallet';
import { loadWallet } from './storage';

async function main()
{
    //createAccount();
    //const wallet = await loadWallet();
    //getBalance(wallet.address);
    testTransaction();
}

main();
