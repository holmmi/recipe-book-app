import React, { useCallback, useContext, useEffect, useState } from 'react'
import { StyleSheet, View, ImageBackground, Dimensions } from 'react-native'
import { IconButton, Text } from 'react-native-paper'
import PropTypes from 'prop-types'
import {
  addFavourite,
  addLike,
  deleteFavourite,
  deleteLike,
  getFavourites,
  getLikes,
  getMultipleFileDetails,
} from '../hooks/ApiHooks'
import { Video } from 'expo-av'
import { SwiperFlatList } from 'react-native-swiper-flatlist'
import * as ScreenOrientation from 'expo-screen-orientation'
import { MainContext } from '../context/MainProvider'

const mediaUploads = 'http://media.mw.metropolia.fi/wbma/uploads/'

const { width, height } = Dimensions.get('window')

const RecipeCard = ({ dataItem }) => {
  const [media, setMedia] = useState([])
  const [videoRef, setVideoRef] = useState(null)
  const [recipeLikes, setRecipeLikes] = useState([])
  const [recipeFavourites, setRecipeFavourites] = useState([])
  const { userDetails } = useContext(MainContext)

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

  useEffect(() => {
    const getMedia = async () => {
      const newMedia = await getMultipleFileDetails(dataItem.media)
      newMedia.unshift(dataItem.filename)
      setMedia(newMedia)
      setRecipeLikes(await getLikes(dataItem.fileId))
      setRecipeFavourites(await getFavourites(dataItem.fileId))
    }
    getMedia()
  }, [])

  const isRecipeInFavourites = useCallback(() => {
    return (
      recipeFavourites.filter(
        (favourite) => favourite.user_id === userDetails.user_id
      ).length > 0
    )
  }, [recipeFavourites])

  const toggleRecipeFavourite = async () => {
    if (isRecipeInFavourites()) {
      await deleteFavourite(dataItem.fileId)
    } else {
      await addFavourite(dataItem.fileId)
    }
    setRecipeFavourites(await getFavourites(dataItem.fileId))
  }

  const isRecipeLiked = useCallback(() => {
    return (
      recipeLikes.filter((like) => like.user_id === userDetails.user_id)
        .length > 0
    )
  }, [recipeLikes])

  const toggleRecipeLike = async () => {
    if (isRecipeLiked()) {
      await deleteLike(dataItem.fileId)
    } else {
      await addLike(dataItem.fileId)
    }
    setRecipeLikes(await getLikes(dataItem.fileId))
  }

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <SwiperFlatList index={0} showPagination paginationActiveColor='tomato'>
          {media.map((item, index) =>
            index === 0 ? (
              <ImageBackground
                key={dataItem.filename}
                style={styles.child}
                source={{ uri: `${mediaUploads}${dataItem.filename}` }}
              >
                <View style={styles.nameContainer}>
                  <Text style={styles.recipeName}>{dataItem.recipeName}</Text>
                </View>
                <View style={styles.socialContainer}>
                  <IconButton
                    icon='star-outline'
                    color={isRecipeInFavourites() ? 'yellow' : 'white'}
                    onPress={toggleRecipeFavourite}
                  />
                  <IconButton
                    icon='heart-outline'
                    color={isRecipeLiked() ? 'red' : 'white'}
                    onPress={toggleRecipeLike}
                  />
                  <Text style={styles.recipeName}>{recipeLikes.length}</Text>
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
                defaultControlsVisible={true}
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
          )}
        </SwiperFlatList>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    alignItems: 'center',
    height: height * 0.3,
  },
  container: {
    padding: 10,
    marginTop: 10,
    marginBottom: 0,
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
  socialContainer: {
    bottom: 15,
    right: 15,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  usernameText: {
    fontWeight: 'bold',
  },
})

RecipeCard.propTypes = {
  dataItem: PropTypes.object,
}

export default RecipeCard
