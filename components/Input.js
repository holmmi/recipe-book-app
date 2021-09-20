import React from 'react'
import { StyleSheet } from 'react-native'
import { TextInput, HelperText } from 'react-native-paper'
import { useController } from 'react-hook-form'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const Input = ({
  name,
  control,
  defaultValue,
  rules,
  secureTextEntry,
  label,
  multiline,
}) => {
  const {
    field,
    fieldState: { invalid, error },
  } = useController({ name, control, defaultValue, rules })
  const { t } = useTranslation()

  return (
    <>
      <TextInput
        mode='outlined'
        value={field.value}
        onChangeText={field.onChange}
        secureTextEntry={secureTextEntry}
        style={styles.textInput}
        error={invalid}
        label={label}
        multiline={multiline}
      />
      {invalid && <HelperText type='error'>{t(error?.message)}</HelperText>}
    </>
  )
}

const styles = StyleSheet.create({
  textInput: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
})

Input.defaultProps = {
  defaultValue: '',
  secureTextEntry: false,
  rules: {},
  multiline: false,
}

Input.propTypes = {
  name: PropTypes.string,
  control: PropTypes.any,
  defaultValue: PropTypes.any,
  secureTextEntry: PropTypes.bool,
  rules: PropTypes.object,
  label: PropTypes.string,
  multiline: PropTypes.bool,
}

export default Input
