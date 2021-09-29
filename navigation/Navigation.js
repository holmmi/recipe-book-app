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
  const { t } = useTranslation()

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: 'tomato' },
        headerTitleStyle: { color: 'white' },
      }}
    >
      <Stack.Group>
        <Stack.Screen
          name='Recipes'
          component={Recipes}
          options={{ headerTitle: t('navigation.recipesStack.recipes') }}
        />
        <Stack.Screen
          name='AddRecipe'
          component={AddRecipe}
          options={{
            headerTitle: t('navigation.recipesStack.addRecipe'),
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}

const SearchStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Search' component={Search} />
      <Stack.Screen name='RecipesSearch' component={RecipesStack} />
    </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator()

const Navigation = () => {
  const { isLogged, setAddingRecipe } = useContext(MainContext)

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
          options={{
            title: t('navigation.bottom.recipes'),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name='SearchTab'
          component={SearchStack}
          options={{ title: t('navigation.bottom.search') }}
        />
        {isLogged && (
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
