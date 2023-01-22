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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import useTypedSelector from '../../../hooks/useTypedSelector';
import {
  LoadingStatusType,
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
  const [errorUndefined, setErrorUndefined] = useState<boolean>(false);
  const [errorGeneric, setErrorGeneric] = useState<boolean>(false);
  const [errorTxFailed, setErrorTxFailed] = useState<boolean>(false);
  const [errorTxRejected, setErrorTxRejected] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SetMessageSchema),
  });

  const onSubmit = (data: any) => {
    actions.setMessage(data.message);
  };

  useEffect(() => {
    setErrorUndefined(false);
    setErrorGeneric(false);
    setErrorTxFailed(false);
    setErrorTxRejected(false);

    setMessageOp.errors.forEach(e => {
      switch (e) {
        case SET_MESSAGE_ERROR.UNDEFINED:
          setErrorUndefined(true);
          break;
        case SET_MESSAGE_ERROR.GENERIC:
          setErrorGeneric(true);
          break;
        case SET_MESSAGE_ERROR.TX_FAILED:
          setErrorTxFailed(true);
          break;
        case SET_MESSAGE_ERROR.TX_REJECTED:
          setErrorTxRejected(true);
          break;
        default:
          break;
      }
    });
  }, [setMessageOp.errors]);

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
      <Button leftIcon={<MdEdit />} variant={'outline'} onClick={onOpen}>
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
                <FormControl isInvalid={Boolean(errors.banner)}>
                  <Wrap>
                    <WrapItem>
                      <FormLabel>Message</FormLabel>
                    </WrapItem>
                    <Spacer />
                    <WrapItem>
                      <Box>Message</Box>
                    </WrapItem>
                  </Wrap>
                  <Input id="banner" {...register('message')} maxLength={100} />
                  <FormHelperText>Max 100 chars</FormHelperText>
                  <FormErrorMessage>
                    {errors.banner && (errors.banner.message as string)}
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
                  <Box
                    hidden={
                      !errorUndefined &&
                      !errorGeneric &&
                      !errorTxFailed &&
                      !errorTxRejected
                    }
                  >
                    {errorUndefined && (
                      <Alert status="error">
                        <AlertIcon />
                        <AlertTitle>Unexpected Error</AlertTitle>
                        <AlertDescription>
                          An unexpected error occured. Please report this error.
                        </AlertDescription>
                      </Alert>
                    )}
                    {errorGeneric && (
                      <Alert status="error">
                        <AlertIcon />
                        <AlertTitle>Generic Error</AlertTitle>
                        <AlertDescription>
                          An error occured. Please try again later.
                        </AlertDescription>
                      </Alert>
                    )}
                    {errorTxFailed && (
                      <Alert status="error">
                        <AlertIcon />
                        <AlertTitle>Transaction Failed</AlertTitle>
                        <AlertDescription>
                          Transaction failed. Please check your transaction via
                          Metamask wallet.
                        </AlertDescription>
                      </Alert>
                    )}
                    {errorTxRejected && (
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
