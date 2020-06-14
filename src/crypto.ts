var mnGen = require('mngen');
import hasha from 'hasha';

function sha256(word: string): string
{
    return hasha(word,{algorithm: 'sha256', encoding: 'hex'});
}

//I will use di function to create my wallet
export function generateMnemonicPrivateKey(): string
{
    const mnemonic: string[] = mnGen.list(4);   //random strings ['home', 'bye', 'bike', 'pen']
    console.log(`Write down those mnemonic words that are used to generate your private key ${mnemonic}`);
    
    let hashes: string[] = [];
    mnemonic.map((word)=> { hashes.push(sha256(word)); });

    let tmp_result1 = sha256( sha256(hashes[0])+sha256(hashes[1]) );
    let tmp_result2 = sha256( sha256(hashes[2])+sha256(hashes[3]) );
    let privateKey = sha256( sha256(tmp_result1)+sha256(tmp_result2) );

    return privateKey;
}