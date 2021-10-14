import React, { useCallback, useContext, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Avatar, Card, IconButton, Subheading, Text } from 'react-native-paper'
import PropTypes from 'prop-types'
import {
  addLike,
  deleteLike,
  getLikes,
  getUserAvatar,
  getUserDetails,
} from '../hooks/ApiHooks'
import { MainContext } from '../context/MainProvider'

const mediaUploads = 'http://media.mw.metropolia.fi/wbma/uploads/'

const ListItem = ({ dataItem, navigation }) => {
  const recipe = dataItem.item
  const { recipeName } = JSON.parse(recipe.description)

  const [publisherDetails, setPublisherDetails] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [recipeLikes, setRecipeLikes] = useState([])
  const { userDetails, isLogged } = useContext(MainContext)

  useEffect(() => {
    const getPublisherDetails = async () => {
      setPublisherDetails(await getUserDetails(recipe.user_id))
      setAvatar(await getUserAvatar(recipe.user_id))
      setRecipeLikes(await getLikes(recipe.file_id))
    }
    getPublisherDetails()
  }, [recipe])

  const isRecipeLiked = useCallback(() => {
    return (
      recipeLikes.filter((like) => like.user_id === userDetails.user_id)
        .length > 0
    )
  }, [recipeLikes])

  const toggleRecipeLike = async () => {
    if (isRecipeLiked()) {
      await deleteLike(recipe.file_id)
    } else {
      await addLike(recipe.file_id)
    }
    setRecipeLikes(await getLikes(recipe.file_id))
  }

  return (
    <Card
      accessible
      onPress={() => navigation.navigate('Recipe', recipe)}
      style={styles.cardContainer}
    >
      <Card.Content style={styles.cardContent}>
        {avatar && (
          <Avatar.Image
            source={{ uri: `${mediaUploads}${avatar.thumbnails.w160}` }}
            style={styles.avatar}
          />
        )}
        <Text style={styles.usernameText}>{publisherDetails?.username}</Text>
      </Card.Content>
      <Card.Cover
        source={{ uri: `${mediaUploads}${recipe.filename}` }}
        style={styles.cardCover}
      />
      <Card.Content style={styles.lowerContainer}>
        <Card.Content style={styles.recipeName}>
          <Subheading>{recipeName}</Subheading>
        </Card.Content>
        {isLogged ? (
          <View style={styles.socialsContainer}>
            <IconButton
              icon='heart-outline'
              color={isRecipeLiked() ? 'red' : 'black'}
              onPress={toggleRecipeLike}
            />
            <Text>{recipeLikes.length}</Text>
          </View>
        ) : null}
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  avatar: {
    marginRight: 5,
  },
  cardContainer: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 0,
  },
  cardCover: {
    marginTop: 10,
    marginBottom: 10,
  },
  cardContent: {
    paddingTop: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  lowerContainer: {
    flexDirection: 'row',
  },
  socialsContainer: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  recipeName: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  usernameText: {
    fontWeight: 'bold',
  },
})

ListItem.propTypes = {
  dataItem: PropTypes.object,
  navigation: PropTypes.object,
}

export default ListItem
