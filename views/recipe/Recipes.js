import { useIsFocused } from '@react-navigation/native'
import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react'
import { StyleSheet, View } from 'react-native'
import { IconButton } from 'react-native-paper'
import List from '../../components/List'
import { MainContext } from '../../context/MainProvider'
import { useLoadRecipes } from '../../hooks/ApiHooks'

const Recipes = ({ navigation }) => {
  const { isLogged, userDetails } = useContext(MainContext)
  const [activeTab, setActiveTab] = useState('all')
  const isFocused = useIsFocused()
  const recipes = useLoadRecipes(isFocused)

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
    return recipes
  }, [activeTab, recipes])

  return (
    <View style={styles.container}>
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
