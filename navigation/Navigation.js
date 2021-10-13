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
import Recipe from '../views/recipe/Recipe'
import SearchResults from '../views/search/SearchResults'

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
          name='Login'
          component={Profile}
          options={{
            headerTitle: t('navigation.bottom.login'),
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name='AddRecipe'
          component={AddRecipe}
          options={{
            headerTitle: t('navigation.recipesStack.addRecipe'),
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name='Recipe'
          component={Recipe}
          options={{
            headerTitle: t('navigation.recipesStack.recipeView'),
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}

const FavouritesStack = () => {
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
          name='Favorites'
          component={Favorites}
          options={{ headerTitle: t('navigation.bottom.favorites') }}
        />
        <Stack.Screen
          name='Login'
          component={Profile}
          options={{
            headerTitle: t('navigation.bottom.login'),
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name='AddRecipe'
          component={AddRecipe}
          options={{
            headerTitle: t('navigation.recipesStack.addRecipe'),
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name='Recipe'
          component={Recipe}
          options={{
            headerTitle: t('navigation.recipesStack.recipeView'),
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}

const SearchStack = () => {
  const { t } = useTranslation()

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: 'tomato' },
        headerTitleStyle: { color: 'white' },
      }}
    >
      <Stack.Screen
        name='Search'
        component={Search}
        options={{ headerTitle: t('navigation.searchStack.search') }}
      />
      <Stack.Screen
        name='SearchResults'
        component={SearchResults}
        options={{ headerTitle: t('navigation.searchStack.searchResults') }}
      />
      <Stack.Screen
        name='Recipe'
        component={Recipe}
        options={{
          headerTitle: t('navigation.recipesStack.recipeView'),
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator()

const Navigation = () => {
  const { isLogged } = useContext(MainContext)

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
                if (!isLogged) {
                  iconName = 'login'
                } else {
                  iconName = 'person-outline'
                }
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
          options={{ title: t('navigation.bottom.search'), headerShown: false }}
        />
        {isLogged && (
          <Tab.Screen
            name='FavoritesTab'
            component={FavouritesStack}
            options={{
              title: t('navigation.bottom.favorites'),
              headerShown: false,
            }}
          />
        )}

        <Tab.Screen
          name='ProfileTab'
          component={Profile}
          options={{
            title: isLogged
              ? t('navigation.bottom.profile')
              : t('navigation.bottom.login'),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default Navigation
