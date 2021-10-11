import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Avatar, Card, IconButton, Subheading, Text } from 'react-native-paper'
import PropTypes from 'prop-types'
import { getLikes, getUserAvatar, getUserDetails } from '../hooks/ApiHooks'

const mediaUploads = 'http://media.mw.metropolia.fi/wbma/uploads/'

const ListItem = ({ dataItem, navigation }) => {
  const recipe = dataItem.item
  const { recipeName } = JSON.parse(recipe.description)

  const [userDetails, setUserDetails] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [recipeLikes, setRecipeLikes] = useState([])

  useEffect(() => {
    const getPublisherDetails = async () => {
      setUserDetails(await getUserDetails(recipe.user_id))
      setAvatar(await getUserAvatar(recipe.user_id))
      setRecipeLikes(await getLikes(recipe.file_id))
    }
    getPublisherDetails()
  }, [recipe])

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
        <Text style={styles.usernameText}>{userDetails?.username}</Text>
      </Card.Content>
      <Card.Cover
        source={{ uri: `${mediaUploads}${recipe.filename}` }}
        style={styles.cardCover}
      />
      <View style={styles.likesContainer}>
        <IconButton icon='heart-outline' color='black' />
        <Text>{recipeLikes.length}</Text>
      </View>
      <Card.Content style={styles.cardContent}>
        <Subheading>{recipeName}</Subheading>
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
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
