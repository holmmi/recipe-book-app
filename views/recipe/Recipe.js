import React, { useLayoutEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { IconButton } from 'react-native-paper'
import PropTypes from 'prop-types'

const Recipe = ({ navigation, route }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon='chevron-left'
          color='white'
          onPress={() => navigation.goBack()}
        />
      ),
    })
  }, [])

  return <View style={styles.container}></View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
})

Recipe.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
}

export default Recipe
