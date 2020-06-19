import {
    NetworkType,
    Account,
    SimpleWallet,
    Password,
    RepositoryFactoryHttp,
    Address,
    AccountInfo,
    TransactionService,
    Transaction,
    TransferTransaction,
    Mosaic,
    MosaicId,
    Deadline,
    UInt64,
    PlainMessage,
    SignedTransaction
} from 'symbol-sdk';
import readlineSync from 'readline-sync';
import {storeSecrets, Secrets} from './storage';
import {generateMnemonicPrivateKey} from './crypto';

export const NETWORKTYPE = NetworkType.TEST_NET;
export const MOSAIC_NAME = 'covidcoin';
const HELP = 'martina.canonaco98@gmail.com or alihbek@outlook.com';
const MOSAIC_ID_COVIDCOIN = '79D507A2D44B9923';
const covidcoin_divisibility = 0;

const nodeUrl = 'http://api-01.eu-central-1.testnet-0951-v1.symboldev.network:3000';
const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
const accountHttp = repositoryFactory.createAccountRepository();

const generationHash = 'D6ECA9D0EC77760CF63C24F8C52F05E6C4F6E415E4A6E1B39FA28FD3F071A048';

const transactionRepository = repositoryFactory.createTransactionRepository();
const receiptHttp = repositoryFactory.createReceiptRepository();
const listener = repositoryFactory.createListener();
const transactionService = new TransactionService(transactionRepository, receiptHttp);

export function createAccount()
{
    console.log('\nPlease enter a unique password (at least 8 character).\n');
    let inputPassword = readlineSync.questionNewPassword('Input a Password: ', {min: 8, max: 16});
    const password = new Password(inputPassword);
    let walletName = readlineSync.question('\nGive to the wallet a name: ');

    const pvtKey = generateMnemonicPrivateKey();
    const wallet = SimpleWallet.createFromPrivateKey(walletName, password, pvtKey, NETWORKTYPE);
    
    const secret: Secrets = {
        password: password,
        privateKey: pvtKey,
        walletName: walletName,
    };

    console.log(`A new wallet is generated with the address: ${wallet.address.pretty()}`);
    console.log(`\nNow you can start to send and receive ${MOSAIC_NAME}!\n`);
    storeSecrets(secret);
}

export async function getAccountInfo(address: Address): Promise<boolean>
{
    //make the request to the http
    accountHttp.getAccountInfo(address).subscribe((accountInfo: AccountInfo) => console.log(accountInfo));

    return true;
}

// creating a Transaction
function createTransaction(rawRecipientAddress: string, amount: number, text: string): TransferTransaction
{
    const recipientAddress = Address.createFromRawAddress(rawRecipientAddress);
    const currency = new MosaicId(MOSAIC_ID_COVIDCOIN);

    const transferTransaction = TransferTransaction.create(
        Deadline.create(),
        recipientAddress,
        [new Mosaic(currency, UInt64.fromUint(amount*Math.pow(10,covidcoin_divisibility)))],
        PlainMessage.create(text),
        NETWORKTYPE,
        UInt64.fromUint(10)
    );

    return transferTransaction;
}

// sign the Transaction
function signTransaction(account: Account, transaction: TransferTransaction): SignedTransaction
{
    return account.sign(transaction, generationHash);
}

// announce the transaction to the network
async function doTransaction(signedTransaction: SignedTransaction): Promise<void>
{
    transactionRepository.announce(signedTransaction).subscribe(
        (transaction) => console.log(transaction),
        (err: Error) => console.log(`It was not possible to perform the transaction ${err}`)
    );
}

export async function getBalance(address: Address): Promise<boolean>
{
    //make the request to the http
    accountHttp.getAccountInfo(address).subscribe((accountInfo: AccountInfo) =>
    {
        //console.log(accountInfo);
        let mosaics = accountInfo.mosaics;
        let mosaic = mosaics.find((mosaic)=>mosaic.id.toHex() == MOSAIC_ID_COVIDCOIN);
        if(mosaic)
        {
            console.log(`\nYou have ${mosaic.amount.toString()} ${MOSAIC_NAME} in your wallet.`);
        }
        else
        {
            console.log(`\nYou have 0 ${MOSAIC_NAME} in your balance.`);
            console.log(`\nYou could ask to ${HELP} for some ${MOSAIC_NAME}`);
        }
    }),
    (err: Error) => {
        console.log(`An error was happening and it was not possible to check the balance ${err}`);
    };     
    return true;
}