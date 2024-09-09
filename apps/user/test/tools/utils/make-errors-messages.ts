import {
  ErrorField,
  ErrorsMessages,
  ErrorsMessagesTypes,
} from '../../../core/utils/error-handler';

export const constructErrorMessages = (
  fields: ErrorField[],
  message?: string,
) => {
  const errorsMessages: ErrorsMessages[] = [];
  for (const field of fields) {
    errorsMessages.push({
      message: message ?? expect.any(String),
      field: field ?? expect.any(String),
    });
  }
  return { errorsMessages };
};
