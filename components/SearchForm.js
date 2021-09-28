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
import { set, useForm } from 'react-hook-form'
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
  const [time, setTime] = useState('')
  const [chips, setChips] = useState(null)
  //let ingredients = ['ghfhghg']

  const onSubmit = () => {
    console.log('data', inputs)
  }

  const addIngredient = () => {
    let list = []
    console.log(inputs.ingredients.indexOf(ingredient))
    if (inputs.ingredients.indexOf(ingredient) === -1) {
      list = inputs.ingredients.concat(ingredient)
      updateIngredients(list)
    }
  }

  const deleteIngredient = (item) => {
    let list = []
    let index = inputs.ingredients.indexOf(item)
    if (index !== -1) {
      list = inputs.ingredients.splice(index, 1)
    }
    updateIngredients(list)
  }

  const updateIngredients = (list) => {
    handleInputChange('ingredients', list)
    setChips(
      list.map((item, index) => (
        <Chip
          key={item}
          icon='information'
          style={styles.chip}
          onClose={() => deleteIngredient(item)}
        >
          {item}
        </Chip>
      ))
    )
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
        label={t('form.search.ingredients')}
        value={ingredient}
        style={styles.inputBox}
        onChangeText={(text) => {
          setIngredient(text)
        }}
      />

      <>{chips}</>

      <Button
        mode='contained'
        uppercase={false}
        color='#F6AE2D'
        style={styles.button}
        labelStyle={{ color: 'white' }}
        onPress={addIngredient}
      >
        Lisää ainesosa
      </Button>

      <TextInput
        label={t('form.search.preparationTime')}
        keyboardType='number-pad'
        value={time}
        style={styles.inputBox}
        onChangeText={(txt) => {
          handleInputChange('time', txt)
          setTime(txt)
        }}
      />

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
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
})

export default SearchForm
