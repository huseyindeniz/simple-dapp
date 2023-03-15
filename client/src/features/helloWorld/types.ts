import { z } from 'zod';

import { Network } from '../wallet/models/network/types/Network';

export enum LoadingStatusType {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
}

// SET MESSAGE
export enum SET_MESSAGE_STATE {
  IDLE,
  REQUESTED,
  TRANSACTION_SENT,
  SUCCESS,
  FAILURE,
}

export enum SET_MESSAGE_ERROR {
  NONE,
  UNDEFINED,
  GENERIC,
  TX_FAILED,
  TX_REJECTED,
}

export const SetMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Message should have at least 1 char')
    .max(100),
});

export type SetMessageOperation = {
  loading: LoadingStatusType;
  opState: SET_MESSAGE_STATE;
  error: SET_MESSAGE_ERROR;
};

export type MessageType = {
  loading: LoadingStatusType;
  data: string | null;
  error: string | null;
};

export type HelloWorldNetworkType = {
  chain: Network;
  contractAddress: string;
};

export type HelloWorldStoreState = {
  network: HelloWorldNetworkType | null;
  isContractLoaded: boolean;
  message: MessageType;
  setMessageOperation: SetMessageOperation;
};

export interface IHelloWorldAPI {
  init(): Promise<boolean>;
  initContract(): Promise<boolean>;
  getNetwork(): HelloWorldNetworkType | null;
  reset(): Promise<void>;
  setMessage(message: string): Promise<string>;
  getMessage(): Promise<string>;
  listenTransaction(txHash: string): void;
}
