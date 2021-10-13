import React, { useCallback, useLayoutEffect } from 'react'
import { Button, StyleSheet, View } from 'react-native'
import { IconButton } from 'react-native-paper'
import PropTypes from 'prop-types'
import { useIsFocused } from '@react-navigation/native'
import { useLoadRecipes } from '../../hooks/ApiHooks'
import List from '../../components/List'
import { useTranslation } from 'react-i18next'

const SearchResults = ({ navigation, route }) => {
  const isFocused = useIsFocused()
  const { recipes } = useLoadRecipes(isFocused)
  const { t } = useTranslation()
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon='tune-vertical'
          color='white'
          onPress={() => navigation.goBack()}
        />
      ),
    })
  }, [])

  const filteredRecipes = useCallback(() => {
    const { diets, preparationTime, recipeName, substances } = route.params
    return recipes.filter((recipe) => {
      const description = JSON.parse(recipe.description)
      return (
        (diets.length == 0 ||
          diets.every((diet) => description['diets'].includes(diet))) &&
        (preparationTime === '' ||
          parseInt(preparationTime, 10) <=
            parseInt(description['preparationTime'], 10)) &&
        (recipeName === '' ||
          description['recipeName']
            .toLowerCase()
            .startsWith(recipeName.toLowerCase())) &&
        (substances.length === 0 ||
          substances.filter((substance) =>
            description['substances'].some((item) =>
              item.substance.toLowerCase().startsWith(substance.toLowerCase())
            )
          ).length > 0)
      )
    })
  }, [recipes, route.params])

  return (
    <View style={styles.container}>
      <List navigation={navigation} recipes={filteredRecipes()} route={route} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
})

SearchResults.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
}
export default SearchResults
