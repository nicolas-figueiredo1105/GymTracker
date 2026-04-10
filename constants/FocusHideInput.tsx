import { TextInput, TextInputProps } from 'react-native'
import React, { useState } from 'react'

type Props = TextInputProps & {
    defaultPlaceholder : string;
}

const FocusHideInput = ({ defaultPlaceholder, onFocus, onBlur, ...props} : Props) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
        {...props}
        placeholder={isFocused ? "" : defaultPlaceholder}
        onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
        }}
        onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
        }}
    />
  )
}

export default FocusHideInput
