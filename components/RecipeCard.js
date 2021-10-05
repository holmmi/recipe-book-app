import React, { useRef, useEffect, useState } from 'react'
import { StyleSheet, View, ImageBackground, Dimensions } from 'react-native'
import { Card, IconButton, Subheading, Text } from 'react-native-paper'
import PropTypes from 'prop-types'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { getRecipeFiles } from '../hooks/ApiHooks'

const mediaUploads = 'http://media.mw.metropolia.fi/wbma/uploads/'
const { height, width } = Dimensions.get('window')

const CarouselPaginationBar = (props) => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.carouselRef.current.snapToItem(props.index)
      }}
    >
      <View
        width={props.width}
        marginHorizontal={4}
        height={3}
        backgroundColor={
          props.inactive ? 'rgba(0, 0, 0, 0.20)' : 'rgba(0, 0, 0, 0.90)'
        }
      ></View>
    </TouchableOpacity>
  )
}

const RecipeCard = ({ recipe, files }) => {
  const [activeSlide, setActiveSlide] = useState(0)
  const carouselRef = useRef(null)

  const mapFiles = (newFiles) => {
    console.log('files', newFiles)

    /*setFiles(
      //firstSlide +
      newFiles.map((item) => {
        console.log('item', item)
        item.media_type === 'video' && (
          <Image source={{ uri: `${mediaUploads}${item.filename}` }}></Image>
        )
      })
    )*/
  }

  const firstSlide = [
    <ImageBackground
      source={{ uri: `${mediaUploads}${recipe.filename}` }}
      resizeMode='cover'
      style={styles.image}
    >
      <View style={styles.nameContainer}>
        <Text style={styles.recipeName}>{recipe.recipeName}</Text>
      </View>
    </ImageBackground>,
  ]

  const getPagination = () => (
    <Pagination
      dotsLength={firstSlide.length}
      activeDotIndex={activeSlide}
      containerStyle={{
        backgroundColor: 'white',
        paddingVertical: 8,
      }}
      dotElement={
        <CarouselPaginationBar width={width / 9} carouselRef={carouselRef} />
      }
      inactiveDotElement={
        <CarouselPaginationBar
          width={width / 9}
          carouselRef={carouselRef}
          inactive
        />
      }
    />
  )

  useEffect(() => {}, [])

  return (
    <View style={styles.container}>
      <View>
        {console.log('file elements', files)}

        {getPagination()}

        <View>
          <Carousel
            ref={carouselRef}
            data={files}
            renderItem={(item) => item.item}
            sliderWidth={width}
            sliderHeight={height}
            itemWidth={width}
            activeSlideAlignment={'start'}
            onSnapToItem={(index) => setActiveSlide(index)}
          />
        </View>
      </View>
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
    height: 200,
    width: '100%',
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
  recipe: PropTypes.object,
  files: PropTypes.array,
}

export default RecipeCard
