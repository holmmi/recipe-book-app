import React, { useLayoutEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'

const Recipes = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon='plus-circle-outline'
          color='white'
          style={{ marginRight: 10 }}
          onPress={() => navigation.navigate('AddRecipe')}
        />
      ),
    })
  })

  return <View style={styles.container}></View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
})

export default Recipes
