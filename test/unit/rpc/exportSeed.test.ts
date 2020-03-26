import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {MetamaskState, Wallet} from "../../../src/interfaces";
import {exportSeed} from "../../../src/rpc/exportSeed";
import {WalletMock} from "../crypto/wallet.mock.test";

chai.use(sinonChai);

describe('Test rpc handler function: exportPrivateKey', () => {

  const walletStub = new WalletMock();

  beforeEach(function () {
    walletStub.getPluginState.returns({polkadot: {account: {
      keyring: {
        address: "5Gk92fkWPUg6KNHSfP93UcPFhwGurM9RKAKU62Dg6upaCfH7",
        // eslint-disable-next-line max-len
        encoded: "0x3053020101300506032b6570042204206162613264643161313265656166646133666461363261613664666132316361cf043e13d9228d8a931ce4cc58efbd1ad6c5e2f1932c3174eb150dfaf9165b73a123032100cf043e13d9228d8a931ce4cc58efbd1ad6c5e2f1932c3174eb150dfaf9165b73",
        encoding: {
          content: ["pkcs8", "ed25519"],
          type: "none",
          version: "2"
        },
        meta: {}
      },
      seed: "aba2dd1a12eeafda3fda62aa6dfa21ca",
    }}} as MetamaskState);
  });

  afterEach(function () {
    walletStub.reset();
  });

  it('should return private key on positive prompt confirmation', async function () {
    walletStub.send.returns(true);
    const result = await exportSeed(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(walletStub.send).to.have.been.calledOnce;
    expect(result).to.be.eq("aba2dd1a12eeafda3fda62aa6dfa21ca");
  });

  it('should not return private key on negative prompt confirmation', async function () {
    walletStub.send.returns(false);
    const result = await exportSeed(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(walletStub.send).to.have.been.calledOnce;
    expect(result).to.be.eq(null);
  });

});