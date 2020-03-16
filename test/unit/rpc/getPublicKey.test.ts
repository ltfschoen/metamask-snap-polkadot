import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import sinon from "sinon";
import {MetamaskState, Wallet} from "../../../src/interfaces";
import {getPublicKey} from "../../../src/rpc/getPublicKey";

chai.use(sinonChai);

describe('rpc handler function: getPublicKey', () => {

  const sandbox = sinon.createSandbox();
  const walletStub = {} as Wallet;

  afterEach(function () {
    sandbox.restore();
  });

  it('should return pk on saved pk in state', async function () {
    walletStub.getPluginState = sandbox.stub().returns({polkadot: {account: {
      publicKey: Uint8Array.from([1, 2, 3]),
      secretKey: Uint8Array.from([1, 2, 3, 4]),
    }}} as MetamaskState);
    const result = await getPublicKey(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(result).to.be.eq("010203");
  });

  it('should create new keypair on no pk saved in state', async function () {
    walletStub.getPluginState = sandbox.stub().returns(null);
    walletStub.getAppKey = sandbox.stub().returns("abasddsa12ssavdasfdas2easdfa21sa");
    walletStub.updatePluginState = sandbox.stub();
    const result = await getPublicKey(walletStub);
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(walletStub.getAppKey).to.have.been.calledOnce;
    expect(walletStub.updatePluginState).to.have.been.calledOnce;
    expect(result).not.to.be.null;
  });
});