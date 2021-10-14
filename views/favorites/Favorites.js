import { useIsFocused } from '@react-navigation/native'
import React, { useContext, useLayoutEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { IconButton } from 'react-native-paper'
import List from '../../components/List'
import { MainContext } from '../../context/MainProvider'
import { useLoadFavourites } from '../../hooks/ApiHooks'
import PropTypes from 'prop-types'

const Favorites = ({ navigation, route }) => {
  const { isLogged, setAddRecipe } = useContext(MainContext)
  const isFocused = useIsFocused()
  const favorites = useLoadFavourites(isFocused)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <IconButton
            icon='plus-circle-outline'
            color='white'
            style={{ marginRight: 10 }}
            onPress={
              isLogged
                ? () => navigation.navigate('AddRecipe')
                : () => {
                    setAddRecipe(true)
                    navigation.navigate('Login')
                  }
            }
          />
        </>
      ),
    })
  }, [isLogged])

  return (
    <View style={styles.container}>
      <List navigation={navigation} recipes={favorites} route={route} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
})

Favorites.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
}

export default Favorites
