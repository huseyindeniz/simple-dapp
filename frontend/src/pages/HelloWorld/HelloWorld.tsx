import { Center, Container, Stack } from '@chakra-ui/react';

import { Message } from '../../features/helloWorld/components/Message';
import { NoContract } from '../../features/helloWorld/components/NoContract';
import { withWalletProtection } from '../../features/wallet/hocs/withWalletProtection';
import useTypedSelector from '../../hooks/useTypedSelector';

export const HelloWorldPage: React.FC = withWalletProtection(() => {
  const isContractLoaded = useTypedSelector(
    state => state.helloWorld.isContractLoaded
  );
  const network = useTypedSelector(state => state.helloWorld.network);
  return (
    <Container maxW={'7xl'} py={2} as={Stack} spacing={2}>
      <Center>
        {isContractLoaded ? <Message /> : <NoContract network={network} />}
      </Center>
    </Container>
  );
});
