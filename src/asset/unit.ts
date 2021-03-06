import {Asset, Wallet} from "../interfaces";
import ApiPromise from "@polkadot/api/promise";
import {getBalance} from "../rpc/substrate/getBalance";
import {getAddress} from "../rpc/getAddress";
import {executeAssetOperation} from "./executeAssetOperation";
import formatBalance from "@polkadot/util/format/formatBalance";
import {Balance} from "@polkadot/types/interfaces";

export function getPolkadotAssetDescription(balance: number|string|Balance, address: string): Asset {
  return {
    balance: formatBalance(balance, {decimals: 12, withSi: true, withUnit: false}),
    customViewUrl: `https://polkascan.io/pre/kusama/account/${address}`,
    decimals: 0,
    identifier: 'ksm-asset',
    image: 'https://img.techpowerup.org/200330/kusama.png',
    symbol: 'KSM',
  };
}

export async function createPolkadotAsset(wallet: Wallet, api: ApiPromise, method: "update" | "add"): Promise<Asset> {

  const [balance, address] = await Promise.all([
    getBalance(wallet, api),
    getAddress(wallet)
  ]);
  const asset = getPolkadotAssetDescription(balance, address);
  // remove asset if already created
  if (method === "add") {
    await executeAssetOperation({identifier: 'ksm-asset'} as Asset, wallet, "remove");
  }
  return await executeAssetOperation(asset, wallet, method);
}