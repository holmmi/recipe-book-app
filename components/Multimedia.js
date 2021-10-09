import React, { useEffect } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Button, IconButton } from 'react-native-paper'
import { useFieldArray } from 'react-hook-form'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import * as ImagePicker from 'expo-image-picker'
import VideoPreview from './VideoPreview'
import { getMultipleFileDetails } from '../hooks/ApiHooks'

const Multimedia = ({ control, defaultValues, name }) => {
  const { append, fields, update } = useFieldArray({ control, name })
  const { t } = useTranslation()

  useEffect(() => {
    const getFileDetails = async () => {
      const files = await getMultipleFileDetails(defaultValues)
      files.forEach((file) => {
        append({
          fileId: file.file_id,
          type: file.media_type,
          uri: `https://media.mw.metropolia.fi/wbma/uploads/${file.filename}`,
          removed: false,
        })
      })
    }
    if (defaultValues.length > 0) {
      getFileDetails()
    }
  }, [defaultValues])

  const addMedia = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
        })
        if (!result.cancelled) {
          append({ type: result.type, removed: false, uri: result.uri })
        }
      }
    }
  }

  const deleteMedia = (index) => {
    if (fields[index]?.fileId) {
      update(index, { fileId: fields[index].fileId, removed: true })
    } else {
      update(index, { removed: true })
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.mediaContainer}>
        {fields.map((field, index) => {
          return field.type === 'image' ? (
            <View key={field.id} style={styles.mediaItem}>
              {!field.removed && (
                <>
                  <Image source={{ uri: field.uri }} style={styles.image} />
                  <IconButton
                    icon='delete'
                    color='white'
                    style={styles.deleteButton}
                    onPress={() => deleteMedia(index)}
                  />
                </>
              )}
            </View>
          ) : (
            <View key={field.id} style={styles.mediaItem}>
              {!field.removed && (
                <>
                  <VideoPreview key={field.id} uri={field.uri} />
                  <IconButton
                    icon='delete'
                    color='white'
                    style={styles.deleteButton}
                    onPress={() => deleteMedia(index)}
                  />
                </>
              )}
            </View>
          )
        })}
      </View>
      <View style={styles.mediaButtonContainer}>
        <Button
          uppercase={false}
          compact={true}
          icon='image'
          mode='contained'
          color='#F6AE2D'
          labelStyle={{ color: 'white' }}
          style={styles.button}
          onPress={addMedia}
        >
          {t('form.newRecipe.addMediaButton')}
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    width: '50%',
    marginTop: 10,
    borderRadius: 100,
  },
  container: {
    flex: 1,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 0,
    backgroundColor: 'black',
    borderRadius: 0,
  },
  image: {
    width: 120,
    height: 120,
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaButtonContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  mediaItem: {
    position: 'relative',
    margin: 10,
  },
})

Multimedia.defaultProps = {
  defaultValues: [],
}

Multimedia.propTypes = {
  control: PropTypes.any,
  name: PropTypes.string,
  onRemoveMedia: PropTypes.func,
}

export default Multimedia
