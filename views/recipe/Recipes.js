import { useIsFocused } from '@react-navigation/native'
import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { IconButton, Button, FAB } from 'react-native-paper'
import List from '../../components/List'
import { MainContext } from '../../context/MainProvider'
import { useLoadRecipes } from '../../hooks/ApiHooks'

const Recipes = ({ navigation, route }) => {
  const { isLogged, userDetails } = useContext(MainContext)
  const [activeTab, setActiveTab] = useState('all')
  const isFocused = useIsFocused()
  const { recipes, pullRefresh, setPullRefresh } = useLoadRecipes(isFocused)
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
    return activeTab === 'own'
      ? recipes.filter((recipe) => recipe.user_id === userDetails.user_id)
      : recipes
  }, [activeTab, recipes])

  return (
    <View style={styles.container}>
      <List
        navigation={navigation}
        onRefresh={() => setPullRefresh(true)}
        recipes={filterRecipes()}
        refreshing={pullRefresh}
        route={route}
        setActiveTab={setActiveTab}
      />
      <FAB
        style={styles.fab}
        small
        icon='plus'
        onPress={
          isLogged
            ? () => navigation.navigate('AddRecipe')
            : () => navigation.navigate('Login')
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
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
