import React, { useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { Headline, Button, TextInput, Chip } from 'react-native-paper'
import { MainContext } from '../context/MainProvider'
import DropDown from 'react-native-paper-dropdown'
import useSearchForm from '../hooks/SearchHooks'
import { search } from '../hooks/ApiHooks'
import DietDropdown from './DietDropdown'

const SearchForm = ({ navigation }) => {
  const { t } = useTranslation()
  const { setSearch } = useContext(MainContext)
  const { inputs, setInputs, handleInputChange } = useSearchForm()
  const [recipeName, setRecipeName] = useState('')
  const [ingredient, setIngredient] = useState('')
  const [time, setTime] = useState('')
  const [chips, setChips] = useState(null)

  const onSubmit = async () => {
    setSearch(true)
    const results = await search(inputs, 'recipe-book')
    console.log(results)
    console.log(inputs)
    navigation.navigate('Recipes', results)
  }

  const addIngredient = () => {
    if (inputs.ingredients.indexOf(ingredient) === -1) {
      let list = inputs.ingredients.concat(ingredient)
      updateIngredients(list)
      setIngredient('')
    }
  }

  const deleteIngredient = (item) => {
    let index = inputs.ingredients.indexOf(item)
    let list = inputs.ingredients.splice(index, 1)
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

      <DietDropdown handleInputChange={handleInputChange} />

      <TextInput
        label={t('form.search.ingredients')}
        value={ingredient}
        style={styles.inputBox}
        onSubmitEditing={addIngredient}
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
        {t('form.search.add')}
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

SearchForm.propTypes = {
  navigation: PropTypes.object.isRequired,
}

export default SearchForm