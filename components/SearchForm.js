import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import {
  Headline,
  Button,
  List,
  TextInput,
  Chip,
  Text,
} from 'react-native-paper'
import { useForm } from 'react-hook-form'
import { apiLogin } from '../hooks/ApiHooks'
import { MainContext } from '../context/MainProvider'
import PropTypes from 'prop-types'
import DropDown from 'react-native-paper-dropdown'
import useSearchForm from '../hooks/SearchHooks'
import { render } from 'react-dom'

const SearchForm = () => {
  const [showDropDown, setShowDropDown] = useState(false)
  const { setIsLogged, setUserDetails } = useContext(MainContext)
  const { t } = useTranslation()
  const { inputs, handleInputChange } = useSearchForm()
  const [showMultiSelectDropDown, setShowMultiSelectDropDown] = useState(false)
  const [diets, setDiets] = useState('')
  const [recipeName, setRecipeName] = useState('')
  const [ingredient, setIngredient] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [chips, setChips] = useState([])

  const onSubmit = () => {
    console.log('data', inputs)
    console.log('diets', diets)
  }

  /*const init = () => {
    setIn
  }*/

  //const ingredients = []

  //let chips = []

  const updateIngredients = () => {
    ingredients.push(ingredient)
    handleInputChange('ingredients', ingredients)
    //console.log(ingredients)
    console.log(inputs)
    setChips(ingredients.map((item) => <Chip icon='information'>{item}</Chip>))
    //console.log(chips)
  }

  const dietList = [
    {
      label: t('diet.glutenfree'),
      value: t('diet.glutenfree'),
    },
    {
      label: t('diet.vegan'),
      value: t('diet.vegan'),
    },
    {
      label: t('diet.vegetarian'),
      value: t('diet.vegetarian'),
    },
  ]

  /*useEffect(() => {
    init()
  }, [])*/

  return (
    <>
      <Headline style={styles.headline}>
        {t('navigation.bottom.search')}
      </Headline>

      <TextInput
        label={t('form.search.recipeName')}
        value={recipeName}
        style={styles.inputBox}
        onChangeText={(text) => {
          handleInputChange('recipe_name', text)
          setRecipeName(text)
        }}
      />

      <DropDown
        label={t('form.search.diet')}
        mode={'outlined'}
        visible={showMultiSelectDropDown}
        style={styles.inputBox}
        showDropDown={() => setShowMultiSelectDropDown(true)}
        onDismiss={() => setShowMultiSelectDropDown(false)}
        value={diets}
        setValue={(diets) => {
          setDiets(diets)
          handleInputChange('diets', diets)
        }}
        list={dietList}
        multiSelect
      />

      <TextInput
        label={t('form.search.recipeName')}
        value={ingredient}
        style={styles.inputBox}
        onChangeText={(text) => {
          setIngredient(text)
        }}
      />
      <Text>{chips}</Text>

      <Button
        mode='contained'
        uppercase={false}
        color='#F6AE2D'
        style={styles.button}
        labelStyle={{ color: 'white' }}
        onPress={updateIngredients}
      >
        Lisää ainesosa
      </Button>

      <Button
        mode='contained'
        uppercase={false}
        color='#F6AE2D'
        style={styles.button}
        labelStyle={{ color: 'white' }}
        onPress={onSubmit}
      >
        {t('form.search.searchButton')}
      </Button>
    </>
  )
}

const styles = StyleSheet.create({
  headline: {
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 100,
  },
  inputBox: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    width: '100%',
  },
})

export default SearchForm
