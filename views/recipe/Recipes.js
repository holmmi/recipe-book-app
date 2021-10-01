import React, { useContext, useLayoutEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { IconButton } from 'react-native-paper'
import List from '../../components/List'
import Tabs from '../../components/Tabs'
import { MainContext } from '../../context/MainProvider'
import { useLoadRecipes } from '../../hooks/ApiHooks'

const tabs = [
  {
    label: 'tabs.recipes.all',
    value: 'all',
  },
  {
    label: 'tabs.recipes.own',
    value: 'own',
  },
]

const Recipes = ({ navigation }) => {
  const { isLogged, userDetails } = useContext(MainContext)
  const [activeTab, setActiveTab] = useState('all')
  const recipes = useLoadRecipes()

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

  return (
    <View style={styles.container}>
      {isLogged && (
        <View style={styles.tabContainer}>
          <Tabs
            defaultValue='all'
            onValueChange={(value) => setActiveTab(value)}
            tabs={tabs}
          />
        </View>
      )}
      <List
        recipes={
          activeTab === 'all'
            ? recipes
            : recipes.filter(
                (recipe) => recipe?.user_id === userDetails?.user_id
              )
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  tabContainer: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
