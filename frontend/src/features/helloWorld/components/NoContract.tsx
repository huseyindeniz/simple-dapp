import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { AlertMessage } from '../../ui/components/AlertMessage/AlertMessage';
import { HelloWorldNetworkType } from '../types';

export interface NoContractProps {
  network: HelloWorldNetworkType | null;
}

export const NoContract: React.FC<NoContractProps> = ({ network }) => {
  const { t } = useTranslation('FeatureHelloWorld');
  return (
    <Box>
      <AlertMessage status="warning" title="No Contract">
        {t('HelloWorld Contract can not initialized from the network')}
        &nbsp;
        {network?.chain.chainName} at address {network?.contractAddress}
      </AlertMessage>
    </Box>
  );
};
