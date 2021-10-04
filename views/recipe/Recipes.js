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
  const recipes = useLoadRecipes(route?.params?.refresh)
  const { t } = useTranslation()

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

  const filterRecipes = useCallback(() => {
    if (activeTab === 'own') {
      return recipes.filter((recipe) => recipe.user_id === userDetails.user_id)
    }
    if (search) {
      return route.params
    }
    return recipes
  }, [activeTab, recipes, search])

  return (
    <View style={styles.container}>
      {search && (
        <Button
          mode='contained'
          uppercase={false}
          color='#F6AE2D'
          style={styles.button}
          labelStyle={{ color: 'white' }}
          onPress={() => setSearch(false)}
        >
          {t('recipe.removeSearch')}
        </Button>
      )}

      <List
        navigation={navigation}
        recipes={filterRecipes()}
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
