/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IHelloWorld,
  IHelloWorldInterface,
} from "../../../contracts/interfaces/IHelloWorld";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "clientAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
    ],
    name: "NewMessage",
    type: "event",
  },
  {
    inputs: [],
    name: "getMessage",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "newMessage",
        type: "string",
      },
    ],
    name: "setMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "terminate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IHelloWorld__factory {
  static readonly abi = _abi;
  static createInterface(): IHelloWorldInterface {
    return new utils.Interface(_abi) as IHelloWorldInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IHelloWorld {
    return new Contract(address, _abi, signerOrProvider) as IHelloWorld;
  }
}
