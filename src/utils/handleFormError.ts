import { UseFormSetError, FieldValues, Path } from 'react-hook-form'
import { getErrorMessage } from './errors'


export function handleFormError<T extends FieldValues>(error: unknown, setError: UseFormSetError<T>, fieldMap?: Record<string, Path<T>>) {
  const message = getErrorMessage(error);

  // Map backend messages to fields
  if (fieldMap) {
    for (const key in fieldMap) {
      if (message.includes(key)) {
        setError(fieldMap[key], {
          type: "server",
          message,
        });
        return;
      }
    }
  }


  // Fallback → global form error
  setError("root", {
    type: "server",
    message,
  });
}