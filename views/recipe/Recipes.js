import React, { useContext, useLayoutEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'
import { MainContext } from '../../context/MainProvider'

const Recipes = ({ navigation }) => {
  const { isLogged } = useContext(MainContext)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          {isLogged && (
            <IconButton
              icon='plus-circle-outline'
              color='white'
              style={{ marginRight: 10 }}
              onPress={() => navigation.navigate('AddRecipe')}
            />
          )}
        </>
      ),
    })
  }, [isLogged])

  return <View style={styles.container}></View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
})

export default Recipes
