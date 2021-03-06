import {Wallet} from "./interfaces";
import {getPublicKey} from "./rpc/getPublicKey";
import {exportSeed} from "./rpc/exportSeed";
import {getBalance} from "./rpc/substrate/getBalance";
import {getAddress} from "./rpc/getAddress";
import ApiPromise from "@polkadot/api/promise";
import {getTransactions} from "./rpc/substrate/getTransactions";
import {getBlock} from "./rpc/substrate/getBlock";
import {createPolkadotAsset} from "./asset/unit";
import {getApi} from "./polkadot/api";

declare let wallet: Wallet;

const apiDependentMethods = ["getBlock", "getBalance", "getChainHead", "addDotAsset", "updateDotAsset"];

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  // init api if needed
  let api: ApiPromise = null;
  if (apiDependentMethods.includes(requestObject.method)) {
    api = await getApi();
  }
  switch (requestObject.method) {
    case 'getPublicKey':
      return await getPublicKey(wallet);
    case 'getAddress':
      return await getAddress(wallet);
    case 'exportSeed':
      return await exportSeed(wallet);
    case 'getAllTransactions':
      return await getTransactions(wallet, requestObject.params["address"] as string);
    case 'getBlock':
      return await getBlock(requestObject.params, api);
    case 'getBalance':
      return await getBalance(wallet, api);
    case 'addDotAsset':
      return await createPolkadotAsset(wallet, api, "add");
    case 'updateDotAsset':
      return await createPolkadotAsset(wallet, api, "update");
    case 'getChainHead':
      // temporary method
      const head = await api.rpc.chain.getFinalizedHead();
      return head.hash;
    default:
      throw new Error('Method not found.');
  }
});