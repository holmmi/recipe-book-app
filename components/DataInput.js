import React from 'react'
import { StyleSheet, View } from 'react-native'
import { HelperText, TextInput } from 'react-native-paper'
import { useController } from 'react-hook-form'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const DataInput = ({ control, multiline, name, rules }) => {
  const {
    field,
    fieldState: { invalid, error },
  } = useController({ control, name, rules })
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <TextInput
        mode='outlined'
        multiline={multiline}
        value={field.value}
        onChangeText={field.onChange}
        error={invalid}
        style={styles.textInput}
      />
      {invalid && <HelperText type='error'>{t(error?.message)}</HelperText>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    width: '100%',
    backgroundColor: 'white',
    textAlign: 'center',
  },
})

DataInput.defaultProps = {
  multiline: false,
  rules: {},
}

DataInput.propTypes = {
  control: PropTypes.any,
  multiline: PropTypes.bool,
  name: PropTypes.string,
  rules: PropTypes.object,
}

export default DataInput
