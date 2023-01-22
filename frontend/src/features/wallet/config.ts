import { GanacheChain } from './chains/ganache';
import { ChainInfoType } from './types';

export const SUPPORTED_NETWORKS: ChainInfoType[] = [GanacheChain];
export const DEFAULT_NETWORK = GanacheChain;
export const SIGN_TIMEOUT_IN_SEC = 60;
export const SLOW_DOWN_IN_MS = 1000;
