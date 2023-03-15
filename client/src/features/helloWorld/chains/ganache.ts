import { GanacheChain } from '../../wallet/chains/ganache';
import { HelloWorldNetworkType } from '../types';

export const WL_RAFFLE_GANACHE: HelloWorldNetworkType = {
  chain: GanacheChain,
  // replace the following contract address when you deploy IHelloWorld.sol contract into Ganache
  contractAddress: '0x8d0218c44749912A3EDEF154c9BA0aEC40737495',
};
