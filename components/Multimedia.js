import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Button, IconButton } from 'react-native-paper'
import { useFieldArray } from 'react-hook-form'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import * as ImagePicker from 'expo-image-picker'
import VideoPreview from './VideoPreview'

const Multimedia = ({ control, name }) => {
  const { append, fields, remove } = useFieldArray({ control, name })
  const { t } = useTranslation()

  const addMedia = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
        })
        if (!result.cancelled) {
          append({ type: result.type, uri: result.uri })
        }
      }
    }
  }

  const deleteMedia = (index) => {
    remove(index)
  }

  return (
    <View style={styles.container}>
      <View style={styles.mediaContainer}>
        {fields.map((field, index) => {
          return field.type === 'image' ? (
            <View key={field.id} style={styles.mediaItem}>
              <Image source={{ uri: field.uri }} style={styles.image} />
              <IconButton
                icon='delete'
                color='white'
                style={styles.deleteButton}
                onPress={() => deleteMedia(index)}
              />
            </View>
          ) : (
            <View key={field.id} style={styles.mediaItem}>
              <VideoPreview key={field.id} uri={field.uri} />
              <IconButton
                icon='delete'
                color='white'
                style={styles.deleteButton}
                onPress={() => deleteMedia(index)}
              />
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

Multimedia.propTypes = {
  control: PropTypes.any,
  name: PropTypes.string,
}

export default Multimedia
