import React, { useRef, useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native'
import { IconButton, Text } from 'react-native-paper'
import PropTypes from 'prop-types'
import { getRecipeFiles } from '../hooks/ApiHooks'
import { Video } from 'expo-av'
import { SwiperFlatList } from 'react-native-swiper-flatlist'
import * as ScreenOrientation from 'expo-screen-orientation'

const mediaUploads = 'http://media.mw.metropolia.fi/wbma/uploads/'

const { width, height } = Dimensions.get('window')

const RecipeCard = ({ dataItem }) => {
  const [media, setMedia] = useState(null)
  const [videoRef, setVideoRef] = useState(null)
  const [done, setDone] = useState(false)
  //const [disabled, setDisabled] = useState(false)

  const handleVideoRef = (component) => {
    setVideoRef(component)
  }

  const unlock = async () => {
    try {
      await ScreenOrientation.unlockAsync()
    } catch (error) {
      console.error('unlock', error.message)
    }
  }

  const lock = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      )
    } catch (error) {
      console.error('lock', error.message)
    }
  }

  useEffect(() => {
    unlock()

    const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
      console.log('orientation', evt)
      if (evt.orientationInfo.orientation > 2) {
        // show video in fullscreen
        showVideoInFullscreen()
      }
    })
    // when leaving the component lock screen to portrait
    return () => {
      ScreenOrientation.removeOrientationChangeListener(orientSub)
      lock()
    }
  }, [videoRef])

  // end screen orientation

  const addMedia = (newFiles, recipe) => {
    setMedia(
      newFiles.map((item, index) =>
        index === 0 ? (
          <ImageBackground
            key={item.filename}
            style={styles.child}
            source={{ uri: `${mediaUploads}${dataItem.filename}` }}
          >
            <View style={styles.nameContainer}>
              <Text style={styles.recipeName}>{recipe.recipeName}</Text>
            </View>
            <View style={styles.likesContainer}>
              <IconButton icon='heart-outline' color='white' />
              <Text style={styles.recipeName}>0</Text>
            </View>
          </ImageBackground>
        ) : item.media_type === 'image' && index > 0 ? (
          <ImageBackground
            key={item.filename}
            style={styles.child}
            source={{ uri: `${mediaUploads}${item.filename}` }}
          ></ImageBackground>
        ) : item.media_type === 'video' ? (
          <Video
            key={item.filename}
            style={styles.child}
            ref={handleVideoRef}
            source={{ uri: `${mediaUploads}${item.filename}` }}
            useNativeControls
            resizeMode='contain'
            usePoster
            posterSource={{ uri: `${mediaUploads}${item.screenshot}` }}
          />
        ) : (
          <View style={styles.child} key={item.filename}>
            <Text>File not supported</Text>
          </View>
        )
      )
    )
  }

  const getMedia = async () => {
    try {
      const newRecipe = await JSON.parse(dataItem.description)

      let media = await getRecipeFiles(newRecipe.media)
      media.unshift(dataItem)
      addMedia(media, newRecipe)

      setDone(true)
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    getMedia()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        {done ? (
          <SwiperFlatList index={0} showPagination>
            {media}
          </SwiperFlatList>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    marginRight: 5,
  },
  carouselContainer: {
    flex: 1,
    alignItems: 'center',
    height: height * 0.3,
  },
  container: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 0,
    flex: 1,
  },
  nameContainer: {
    bottom: 15,
    left: 15,
    position: 'absolute',
  },
  child: {
    height: height * 0.3,
    width: width - 40,
    justifyContent: 'center',
  },
  recipeName: {
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 5,
    fontSize: 30,
  },
  likesContainer: {
    bottom: 15,
    right: 15,
    position: 'absolute',
    flexDirection: 'row',
  },
  usernameText: {
    fontWeight: 'bold',
  },
})

RecipeCard.propTypes = {
  dataItem: PropTypes.object,
}

export default RecipeCard
