import { useEffect, useState, useRef, type MouseEvent } from 'react';
import { withConfiguration, Input, FieldValueList, Text } from '@pega/cosmos-react-core';
import '../create-nonce';

type PasswordInputProps = {
  getPConnect: any;
  label: string;
  value: string;
  helperText?: string;
  placeholder?: string;
  validatemessage?: string;
  hideLabel: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  testId?: string;
  fieldMetadata?: any;
  additionalProps?: any;
  displayMode?: string;
  variant?: any;
  hasSuggestions?: boolean;
  showVisibilityToggle?: boolean;
};

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file

export const PegaExtensionsPasswordInput = (props: PasswordInputProps) => {
  const {
    getPConnect,
    placeholder,
    validatemessage,
    label,
    hideLabel = false,
    helperText,
    testId,
    fieldMetadata,
    additionalProps,
    displayMode,
    variant,
    hasSuggestions,
    showVisibilityToggle = true
  } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const maxLength = fieldMetadata?.maxLength;
  const hasValueChange = useRef(false);

  let { readOnly, required, disabled } = props;
  const { value } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    prop => prop === true || (typeof prop === 'string' && prop === 'true')
  );

  const [inputValue, setInputValue] = useState(value);
  const [status, setStatus] = useState(hasSuggestions ? 'pending' : undefined);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => setInputValue(value), [value]);

  useEffect(() => {
    if (validatemessage !== '') {
      setStatus('error');
    }
    if (hasSuggestions) {
      setStatus('pending');
    } else if (!hasSuggestions && status !== 'success') {
      setStatus(validatemessage !== '' ? 'error' : undefined);
    }
  }, [validatemessage, hasSuggestions, status]);

  const displayComp = value ? '***********' : '';
  if (displayMode === 'DISPLAY_ONLY') {
    return <Text>{displayComp}</Text>;
  }
  if (displayMode === 'LABELS_LEFT') {
    return (
      <FieldValueList
        variant={hideLabel ? 'stacked' : variant}
        data-testid={testId}
        fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
      />
    );
  }
  if (displayMode === 'STACKED_LARGE_VAL') {
    return (
      <Text variant='h1' as='span'>
        {displayComp}
      </Text>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <Input
        {...additionalProps}
        type={showPassword ? 'text' : 'password'}
        label={label}
        labelHidden={hideLabel}
        info={validatemessage || helperText}
        data-testid={testId}
        value={inputValue}
        status={status}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        maxLength={maxLength}
        onChange={(e: MouseEvent<HTMLInputElement>) => {
          if (hasSuggestions) {
            setStatus(undefined);
          }
          setInputValue(e.currentTarget.value);
          if (value !== e.currentTarget.value) {
            actions.updateFieldValue(propName, e.currentTarget.value);
            hasValueChange.current = true;
          }
        }}
        onBlur={(e: MouseEvent<HTMLInputElement>) => {
          if ((!value || hasValueChange.current) && !readOnly) {
            actions.triggerFieldChange(propName, e.currentTarget.value);
            if (hasSuggestions) {
              pConn.ignoreSuggestion();
            }
            hasValueChange.current = false;
          }
        }}
      />
      {showVisibilityToggle && (
        <button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '10px',
            top: '57%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
        >
          {showPassword ? (
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'>
              <path
                d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3z'
                fill='currentColor'
              />
            </svg>
          ) : (
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'>
              <path
                d='M12 7c2.76 0 5 2.24 5 5c0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28l.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22L21 20.73L3.27 3L2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65c0 1.66 1.34 3 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53c-2.76 0-5-2.24-5-5c0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15l.02-.16c0-1.66-1.34-3-3-3l-.17.01z'
                fill='currentColor'
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default withConfiguration(PegaExtensionsPasswordInput);
