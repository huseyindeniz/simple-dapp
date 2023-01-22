import { Contract, ethers } from 'ethers';

import { HelloWorld__factory, IHelloWorld } from '../../../blockchain/types';
import { SUPPORTED_NETWORKS } from '../../../features/helloWorld/config';
import {
  HelloWorldNetworkType,
  IHelloWorldAPI,
  SET_MESSAGE_ERROR,
} from '../../../features/helloWorld/types';
import { IWalletProviderApi } from '../../../features/wallet/types';

export class EthersHelloWorldAPI implements IHelloWorldAPI {
  private static _instance: IHelloWorldAPI | null = null;
  private _isInitialized: boolean = false;
  private _isContractInitialized: boolean = false;
  private _provider: ethers.providers.Web3Provider | null = null;
  private _signer: string | null = null;
  private _connectedWallet: IWalletProviderApi;
  private _contract: IHelloWorld | null = null;
  private _network: HelloWorldNetworkType | null = null;

  private constructor(walletProviderApi: IWalletProviderApi) {
    this._connectedWallet = walletProviderApi;
  }

  public static getInstance(
    walletProviderApi: IWalletProviderApi
  ): IHelloWorldAPI {
    if (this._instance === null) {
      console.debug('hello world init');
      this._instance = new EthersHelloWorldAPI(walletProviderApi);
    }
    return this._instance;
  }

  public init = async () => {
    if (!this._isInitialized) {
      this._provider = this._connectedWallet.getProvider();
      if (!this._provider) {
        return false;
      }
      await this._provider.ready;
      this._signer = this._connectedWallet.getSigner();
      if (!this._signer) {
        return false;
      }
      const connectedNetwork = await this._provider.getNetwork();
      const network = SUPPORTED_NETWORKS.find(
        n => n.chain.chainId === connectedNetwork?.chainId
      );
      if (network === undefined) {
        return false;
      }
      this._network = network;
      this._isInitialized = true;
      return true;
    }
    return this._network ? true : false;
  };

  public initContract = async () => {
    if (this._isInitialized && this._isContractInitialized) {
      return true;
    }
    let result = false;
    try {
      if (
        this._isInitialized &&
        this._network &&
        this._provider &&
        this._signer
      ) {
        this._contract = new Contract(
          this._network.contractAddress,
          HelloWorld__factory.abi,
          this._provider.getSigner(this._signer)
        ) as IHelloWorld;
        const code = await this._provider.getCode(
          this._network.contractAddress
        );
        if (code === '0x') {
          console.log(this._provider);
          throw new Error('Contract can not be found on the selected chain:');
        }
        console.log('CONTRACT INITALIZED');
        result = true;
        this._isContractInitialized = true;
      }
    } catch {
      result = false;
    }
    return result;
  };

  public reset = async () => {
    this._isInitialized = false;
    this._isContractInitialized = false;
  };

  public getNetwork(): null | HelloWorldNetworkType {
    return this._network;
  }

  public getMessage = async () => {
    const result = await this._contract?.getMessage();
    return result ?? '';
  };

  public setMessage = async (message: string) => {
    try {
      const createTx = await this._contract?.setMessage(message);
      const createRcpt = await createTx?.wait();
      if (createRcpt?.status === 1) {
        return true;
      } else {
        return SET_MESSAGE_ERROR.TX_FAILED;
      }
    } catch (error: any) {
      if (error.message?.endsWith('User denied transaction signature.')) {
        return SET_MESSAGE_ERROR.TX_REJECTED;
      } else {
        return SET_MESSAGE_ERROR.UNDEFINED;
      }
    }
  };
}
