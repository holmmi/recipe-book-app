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

const mediaUploads = 'http://media.mw.metropolia.fi/wbma/uploads/'
const { height, width } = Dimensions.get('window')

const RecipeCard = ({ dataItem }) => {
  const [recipe, setRecipe] = useState({})
  const [files, setFiles] = useState([])
  const [videoRef, setVideoRef] = useState(null)
  const [done, setDone] = useState(false)
  const [firstSlide, setFirstSlide] = useState('')
  const [disabled, setDisabled] = useState(false)

  const addFirstSlide = (recipe) => {
    setFirstSlide([
      <View>
        <ImageBackground
          source={{ uri: `${mediaUploads}${dataItem.filename}` }}
          resizeMode='cover'
          style={styles.image}
        >
          <View style={styles.nameContainer}>
            <Text style={styles.recipeName}>{recipe.recipeName}</Text>
          </View>
        </ImageBackground>
      </View>,
    ])
  }

  const handleVideoRef = (component) => {
    setVideoRef(component)
  }

  const getMedia = async () => {
    //console.log('dataitem', dataItem)
    const newRecipe = await JSON.parse(dataItem.description)

    //console.log('newRecipe', newRecipe)
    //firstSlide(newRecipe)
    console.log()
    addFirstSlide(newRecipe)
    setFiles(await getRecipeFiles(newRecipe.media))
    setRecipe(newRecipe)
    setDone(true)
  }

  useEffect(() => {
    getMedia()
  }, [])

  return (
    <View style={styles.container}>
      <SwiperFlatList
        autoplay
        autoplayDelay={2}
        autoplayLoop
        index={files.length - 1}
        showPagination
        data={files}
        renderItem={({ item }) =>
          item.media_type === 'image' ? (
            <Image
              key={item.filename}
              style={styles.image}
              source={{ uri: `${mediaUploads}${item.filename}` }}
            />
          ) : item.media_type === 'video' ? (
            <TouchableOpacity // usePoster hides video so use this to start it
              disabled={disabled}
              onPress={() => {
                videoRef.playAsync()
                setDisabled(true) // disable touchableOpacity when video is started
              }}
            >
              <Video
                ref={handleVideoRef}
                style={styles.image}
                source={{ uri: `${mediaUploads}${item.filename}` }}
                useNativeControls
                resizeMode='contain'
                usePoster
                posterSource={{ uri: `${mediaUploads}${item.screenshot}` }}
              />
            </TouchableOpacity>
          ) : (
            <View>File not supported</View>
          )
        }
      />

      <View style={styles.content}></View>
      <View style={styles.likesContainer}>
        <IconButton icon='heart-outline' color='black' />
        <Text>0</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    marginRight: 5,
  },
  container: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 0,
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    aspectRatio: 1,
  },
  nameContainer: {
    bottom: 15,
    left: 15,
    position: 'absolute',
  },
  recipeName: {
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 5,
    fontSize: 30,
  },
  content: {
    paddingTop: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  usernameText: {
    fontWeight: 'bold',
  },
})

RecipeCard.propTypes = {
  dataItem: PropTypes.object,
}

export default RecipeCard
