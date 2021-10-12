import { useIsFocused } from '@react-navigation/native'
import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { IconButton, Button } from 'react-native-paper'
import List from '../../components/List'
import { MainContext } from '../../context/MainProvider'
import { useLoadRecipes } from '../../hooks/ApiHooks'

const Recipes = ({ navigation, route }) => {
  const { isLogged, userDetails, search, setSearch } = useContext(MainContext)
  const [activeTab, setActiveTab] = useState('all')
  const isFocused = useIsFocused()
  const recipes = useLoadRecipes(isFocused)
  const { t } = useTranslation()

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
                : () => navigation.navigate('Login')
            }
          />
        </>
      ),
    })
  }, [isLogged])

  const filterRecipes = useCallback(() => {
    if (search) {
      return activeTab === 'own'
        ? route.params.filter(
            (recipe) => recipe.user_id === userDetails.user_id
          )
        : route.params
    } else {
      if (activeTab === 'own') {
        return recipes.filter(
          (recipe) => recipe.user_id === userDetails.user_id
        )
      }
      return recipes
    }
  }, [activeTab, recipes, search, route])

  return (
    <View style={styles.container}>
      {search && (
        <Button
          mode='contained'
          uppercase={false}
          color='#F6AE2D'
          labelStyle={{ color: 'white' }}
          onPress={() => setSearch(false)}
        >
          {t('form.search.removeSearch')}
        </Button>
      )}

      <List
        navigation={navigation}
        recipes={filterRecipes()}
        route={route}
        setActiveTab={setActiveTab}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  toggleButton: {
    width: 100,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'tomato',
    backgroundColor: 'white',
  },
})

export default Recipes
