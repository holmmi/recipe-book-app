import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
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

const RecipeCard = ({ dataItem }) => {
  const [media, setMedia] = useState([])
  const [videoRef, setVideoRef] = useState(null)
  const [recipeLikes, setRecipeLikes] = useState([])
  const [recipeFavourites, setRecipeFavourites] = useState([])
  const { userDetails, isLogged } = useContext(MainContext)
  const [disabled, setDisabled] = useState(false)
  const [dims, setDims] = useState({ width: 0, height: 0 })

  const getDims = () => {
    const { width, height } = Dimensions.get('window')
    setDims({ width, height })
  }

  const handleVideoRef = (component) => {
    setVideoRef(component)
  }

  const unlock = async () => {
    try {
      await ScreenOrientation.unlockAsync()
    } catch (error) {
      throw error
    }
  }

  Dimensions.addEventListener('change', () => {
    getDims()
  })

  const lock = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      )
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    getDims()
    unlock()

    const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
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

  const showVideoInFullscreen = async () => {
    try {
      if (videoRef) await videoRef.presentFullscreenPlayer()
    } catch (error) {
      throw error
    }
  }

  const getMedia = async () => {
    try {
      const newMedia = (await getMultipleFileDetails(dataItem.media)).filter(
        (item) => item != null
      )
      newMedia.unshift(dataItem.filename)
      setMedia(newMedia)
      setRecipeLikes(await getLikes(dataItem.fileId))
      setRecipeFavourites(await getFavourites(dataItem.fileId))
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    getMedia()
  }, [dataItem])

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
      <View style={[{ height: dims.height * 0.2 }, styles.carouselContainer]}>
        <SwiperFlatList index={0} showPagination paginationActiveColor='tomato'>
          {media.map((item, index) =>
            index === 0 ? (
              <ImageBackground
                key={dataItem.filename}
                style={[
                  { height: dims.height * 0.25, width: dims.width - 40 },
                  styles.child,
                ]}
                source={{ uri: `${mediaUploads}${dataItem.filename}` }}
              >
                <View style={styles.nameContainer}>
                  <Text style={styles.recipeName}>{dataItem.recipeName}</Text>
                </View>
                {isLogged ? (
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
                ) : null}
              </ImageBackground>
            ) : item.media_type === 'image' && index > 0 ? (
              <ImageBackground
                key={item.filename}
                style={[
                  { height: dims.height * 0.25, width: dims.width - 40 },
                  styles.child,
                ]}
                source={{ uri: `${mediaUploads}${item.filename}` }}
              ></ImageBackground>
            ) : item.media_type === 'video' ? (
              <TouchableOpacity
                key={item.filename} // usePoster hides video so use this to start it
                disabled={disabled}
                onPress={() => {
                  videoRef.playAsync()
                  setDisabled(true) // disable touchableOpacity when video is started
                }}
              >
                <Video
                  style={[
                    { height: dims.height * 0.25, width: dims.width - 40 },
                    styles.child,
                  ]}
                  defaultControlsVisible={true}
                  ref={handleVideoRef}
                  source={{ uri: `${mediaUploads}${item.filename}` }}
                  useNativeControls
                  resizeMode='contain'
                  usePoster
                  posterSource={{ uri: `${mediaUploads}${item.screenshot}` }}
                />
              </TouchableOpacity>
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
