import { Box, Center, VStack, Progress, Text, Card } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import useTypedSelector from '../../../hooks/useTypedSelector';
import { AlertMessage } from '../../ui/components/AlertMessage/AlertMessage';
import { LoadingStatusType } from '../types';
import useActions from '../useActions';

import { SetMessageForm } from './SetMessageForm';

export const Message: React.FC = () => {
  const { t } = useTranslation('FeatureHelloWorld');

  const actions = useActions();
  const message = useTypedSelector(state => state.helloWorld.message);

  useEffect(() => {
    actions.getMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Loading = (
    <VStack>
      <Box w="md">
        <Progress size="xs" isIndeterminate />
      </Box>
      <Box>
        <Text fontSize="xs">{t('Getting message from blockchain...')}</Text>
      </Box>
    </VStack>
  );
  const Error = (
    <Center>
      <AlertMessage status="error" title={t('Message can not be retrieved!..')}>
        {message.error}
      </AlertMessage>
    </Center>
  );
  const Content = (
    <Card m="2" p="2">
      <Box>
        {t('Current Message')}: {message.data}
      </Box>
    </Card>
  );

  return (
    <VStack spacing={4} mt="2">
      {message.data !== undefined ? Content : message.error ? Error : null}
      {message.loading === LoadingStatusType.PENDING ? Loading : null}
      <SetMessageForm />
    </VStack>
  );
};
