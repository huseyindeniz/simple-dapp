import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  Spacer,
  useColorModeValue,
  useDisclosure,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { MdEdit } from '@react-icons/all-files/md/MdEdit';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import useTypedSelector from '../../../hooks/useTypedSelector';
import {
  LoadingStatusType,
  SetMessageRequest,
  SetMessageSchema,
  SET_MESSAGE_ERROR,
  SET_MESSAGE_STATE,
} from '../types';
import useActions from '../useActions';

export const SetMessageForm: React.FC = () => {
  const { t } = useTranslation('FeatureWlRaffle');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const actions = useActions();
  const setMessageOp = useTypedSelector(
    state => state.helloWorld.setMessageOperation
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SetMessageRequest>({
    resolver: zodResolver(SetMessageSchema),
  });

  const onSubmit = (data: SetMessageRequest) => {
    actions.setMessage(data);
  };

  const handleSuccess = () => {
    onClose();
    actions.getMessage();
  };

  useEffect(() => {
    if (setMessageOp.opState === SET_MESSAGE_STATE.SUCCESS) {
      const timer = setTimeout(handleSuccess, 3000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMessageOp.opState]);

  return (
    <>
      <Button
        leftIcon={<MdEdit />}
        variant="solid"
        onClick={onOpen}
        colorScheme="yellow"
        isDisabled={
          setMessageOp.opState === SET_MESSAGE_STATE.REQUESTED ||
          setMessageOp.opState === SET_MESSAGE_STATE.TRANSACTION_SENT
        }
        isLoading={
          setMessageOp.opState === SET_MESSAGE_STATE.REQUESTED ||
          setMessageOp.opState === SET_MESSAGE_STATE.TRANSACTION_SENT
        }
        loadingText={t('waiting tx to finalize') as string}
      >
        Set Message
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('Set message')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <Box
                rounded={'md'}
                border={'1px solid'}
                borderColor={borderColor}
                mt={2}
                p={2}
              >
                <FormControl isInvalid={Boolean(errors.message)}>
                  <Wrap>
                    <WrapItem>
                      <FormLabel>Message</FormLabel>
                    </WrapItem>
                    <Spacer />
                    <WrapItem>
                      <Box>Message</Box>
                    </WrapItem>
                  </Wrap>
                  <Input
                    id="message"
                    {...register('message')}
                    maxLength={100}
                  />
                  <FormHelperText>Max 100 chars</FormHelperText>
                  <FormErrorMessage>
                    {errors.message && (errors.message.message as string)}
                  </FormErrorMessage>
                </FormControl>
              </Box>

              <Center mb={2}>
                <VStack>
                  <Box>
                    <Button
                      mt={4}
                      size={'lg'}
                      colorScheme="yellow"
                      type="button"
                      onClick={handleSubmit(onSubmit)}
                      isDisabled={
                        setMessageOp.loading === LoadingStatusType.PENDING ||
                        setMessageOp.opState === SET_MESSAGE_STATE.SUCCESS
                      }
                      isLoading={
                        setMessageOp.loading === LoadingStatusType.PENDING
                      }
                    >
                      {t('Set Message')}
                    </Button>
                  </Box>
                  {setMessageOp.opState === SET_MESSAGE_STATE.REQUESTED && (
                    <Box textAlign={'center'}>
                      <Alert status="warning">
                        <AlertIcon />
                        {t(
                          'Waiting transaction to be accepted. Please check your Metamask wallet.'
                        )}
                      </Alert>
                    </Box>
                  )}
                  {setMessageOp.opState ===
                    SET_MESSAGE_STATE.TRANSACTION_SENT && (
                    <Box>
                      <Alert status="info">
                        <AlertIcon />
                        {t(
                          'Transaction sent. You can either close this form or wait to see transaction result.'
                        )}
                      </Alert>
                      <Progress
                        size="xs"
                        colorScheme={'green'}
                        isIndeterminate
                      />
                    </Box>
                  )}
                  {setMessageOp.opState === SET_MESSAGE_STATE.SUCCESS && (
                    <Box>
                      <Alert status="success">
                        <AlertIcon />
                        {t(
                          'Transaction successfull. You can either close this form or it will be closed automatically.'
                        )}
                      </Alert>
                      <Progress
                        size="xs"
                        colorScheme={'green'}
                        isIndeterminate
                      />
                    </Box>
                  )}
                  <Box hidden={setMessageOp.error === SET_MESSAGE_ERROR.NONE}>
                    {setMessageOp.error === SET_MESSAGE_ERROR.UNDEFINED && (
                      <Alert status="error">
                        <AlertIcon />
                        <AlertTitle>Unexpected Error</AlertTitle>
                        <AlertDescription>
                          An unexpected error occured. Please report this error.
                        </AlertDescription>
                      </Alert>
                    )}
                    {setMessageOp.error === SET_MESSAGE_ERROR.GENERIC && (
                      <Alert status="error">
                        <AlertIcon />
                        <AlertTitle>Generic Error</AlertTitle>
                        <AlertDescription>
                          An error occured. Please try again later.
                        </AlertDescription>
                      </Alert>
                    )}
                    {setMessageOp.error === SET_MESSAGE_ERROR.TX_FAILED && (
                      <Alert status="error">
                        <AlertIcon />
                        <AlertTitle>Transaction Failed</AlertTitle>
                        <AlertDescription>
                          Transaction failed. Please check your transaction via
                          Metamask wallet.
                        </AlertDescription>
                      </Alert>
                    )}
                    {setMessageOp.error === SET_MESSAGE_ERROR.TX_REJECTED && (
                      <Alert status="error">
                        <AlertIcon />
                        <AlertTitle>Transaction Rejected</AlertTitle>
                        <AlertDescription>
                          You rejected the transaction. In order to complete
                          this operation you need to approve the transaction.
                        </AlertDescription>
                      </Alert>
                    )}
                  </Box>
                </VStack>
              </Center>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
