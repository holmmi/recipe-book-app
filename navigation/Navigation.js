import React, { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialIcons } from '@expo/vector-icons'
import { MainContext } from '../context/MainProvider'
import { useTranslation } from 'react-i18next'
import Recipes from '../views/recipe/Recipes'
import AddRecipe from '../views/recipe/AddRecipe'
import Search from '../views/search/Search'
import Favorites from '../views/favorites/Favorites'
import Profile from '../views/profile/Profile'

const Stack = createNativeStackNavigator()

const RecipesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Recipes' component={Recipes} />
      <Stack.Screen name='AddRecipe' component={AddRecipe} />
    </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator()

const Navigation = () => {
  const { isLoggedIn } = useContext(MainContext)

  const { t } = useTranslation()

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName
            switch (route.name) {
              case 'RecipesTab':
                iconName = 'food-bank'
                break
              case 'FavoritesTab':
                iconName = 'star-outline'
                break
              case 'SearchTab':
                iconName = 'search'
                break
              case 'ProfileTab':
                iconName = 'person-outline'
                break
              default:
                break
            }
            return <MaterialIcons name={iconName} color={color} size={size} />
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          headerStyle: { backgroundColor: 'tomato' },
          headerTitleStyle: { color: 'white' },
        })}
      >
        <Tab.Screen
          name='RecipesTab'
          component={RecipesStack}
          options={{ title: t('navigation.bottom.recipes') }}
        />
        <Tab.Screen
          name='SearchTab'
          component={Search}
          options={{ title: t('navigation.bottom.search') }}
        />
        {isLoggedIn && (
          <Tab.Screen
            name='FavoritesTab'
            component={Favorites}
            options={{ title: t('navigation.bottom.favorites') }}
          />
        )}
        <Tab.Screen
          name='ProfileTab'
          component={Profile}
          options={{ title: t('navigation.bottom.profile') }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default Navigation
