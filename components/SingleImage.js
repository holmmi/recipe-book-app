import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Image, Platform } from 'react-native'
import { ActivityIndicator, Button, Text, HelperText } from 'react-native-paper'
import { useController } from 'react-hook-form'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import * as ImagePicker from 'expo-image-picker'

const SingleImage = ({ name, control, rules, label, fileUri, setValue }) => {
  const {
    fieldState: { error },
  } = useController({ name, control, rules })
  const [imageFileUri, setImageFileUri] = useState(fileUri)
  const { t } = useTranslation()

  useEffect(() => {
    setValue('coverPhoto', imageFileUri)
  }, [imageFileUri])

  const choosePicture = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync()
        if (!result.cancelled) {
          setImageFileUri(result.uri)
        }
      }
    }
  }

  const takePhoto = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status === 'granted') {
        const result = await ImagePicker.launchCameraAsync()
        if (!result.cancelled) {
          setImageFileUri(result.uri)
        }
      }
    }
  }

  return (
    <View>
      <Text>{label}</Text>
      {imageFileUri && (
        <Image
          source={{ uri: imageFileUri }}
          style={styles.image}
          loadingIndicatorSource={<ActivityIndicator color='#ccc' />}
        />
      )}
      {error && <HelperText type='error'>{t(error?.message)}</HelperText>}
      <View style={styles.buttonContainer}>
        <Button
          mode='contained'
          icon='image'
          compact={true}
          uppercase={false}
          labelStyle={{ color: 'white' }}
          style={styles.button}
          color='#F6AE2D'
          onPress={choosePicture}
        >
          {t('singleImage.choosePhoto')}
        </Button>
        <Button
          mode='contained'
          icon='camera'
          compact={true}
          uppercase={false}
          labelStyle={{ color: 'white' }}
          style={styles.button}
          color='#F6AE2D'
          onPress={takePhoto}
        >
          {t('singleImage.takePhoto')}
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    margin: 4,
    borderRadius: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    margin: 20,
    width: 180,
    height: 120,
    alignSelf: 'center',
  },
})

SingleImage.defaultProps = {
  fileUri: null,
  label: '',
  rules: {},
}

SingleImage.propTypes = {
  name: PropTypes.string,
  control: PropTypes.any,
  rules: PropTypes.object,
  label: PropTypes.string,
  fileUri: PropTypes.string,
  setValue: PropTypes.func,
}

export default SingleImage
