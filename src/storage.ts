import os from 'os';
import fs from 'fs';
import { Password, SimpleWallet, NetworkType } from 'symbol-sdk';
import readlineSync from 'readline-sync';
import {MOSAIC_NAME, NETWORKTYPE} from './wallet';

export type Secrets = {
    password: Password,
    privateKey: string,
    walletName: string
}

export function storeSecrets(secrets: Secrets) //this will be a new type
{
    const PATH_HOME = `${os.homedir()}/${MOSAIC_NAME}-wallets`;
    const PATH_WALLET = `${PATH_HOME}/${MOSAIC_NAME}-wallet.enry`;
    
    if(!fs.existsSync(PATH_HOME))
    {
        fs.mkdirSync(PATH_HOME);
    }

    let fullPath = PATH_WALLET;
    if(fs.existsSync(fullPath))
    {
        const stamp = new Date().toISOString();
        fullPath = `${PATH_HOME}/${stamp}-${MOSAIC_NAME}-secrets.enry`;
    }

    fs.writeFileSync(fullPath, JSON.stringify(secrets));
    //how create these secrets?

    console.log(`Secrets stored! ${fullPath}`);
}

export async function loadWallet(): Promise<SimpleWallet>
{
    const PATH_HOME = `${os.homedir()}/${MOSAIC_NAME}-wallets`;
    const PATH_WALLET = `${PATH_HOME}/${MOSAIC_NAME}-wallet.enry`;

    const text = fs.readFileSync(PATH_WALLET, 'utf8');
    const secrets: Secrets = JSON.parse(text);

    //i want to keep things in a safer way
    const password = readlineSync.question('\nInput Password: ');
    //check if the passwords are corrisponding
    if(password!=secrets.password.value)
    {
        console.log('\n Password provided is wrong!');
        loadWallet();
    }
    console.log('\nRight Password was provided!');

    //now i need to import wallet's infos
    const wallet = SimpleWallet.createFromPrivateKey(
        secrets.walletName,
        secrets.password,
        secrets.privateKey,
        NETWORKTYPE
    );
    
    console.log(`\nWallet Public Key is: ${wallet.address.pretty()}`);
    return wallet;
}