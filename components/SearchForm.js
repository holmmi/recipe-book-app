import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { Headline, Button, List } from 'react-native-paper'
import { useForm } from 'react-hook-form'
import Input from './Input'
import { apiLogin } from '../hooks/ApiHooks'
import { MainContext } from '../context/MainProvider'
import PropTypes from 'prop-types'
import DropDown from 'react-native-paper-dropdown'

const SearchForm = () => {
  const [showDropDown, setShowDropDown] = useState(false)
  const { setIsLogged, setUserDetails } = useContext(MainContext)
  const { t } = useTranslation()
  const { control, handleSubmit } = useForm()
  const [showMultiSelectDropDown, setShowMultiSelectDropDown] = useState(false)
  const [diets, setDiets] = useState('')

  const onSubmit = async (data) => {}

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
      <Input
        name='recipe_name'
        control={control}
        label={t('form.search.recipeName')}
      />

      <DropDown
        label={t('form.search.diet')}
        mode={'outlined'}
        visible={showMultiSelectDropDown}
        showDropDown={() => setShowMultiSelectDropDown(true)}
        onDismiss={() => setShowMultiSelectDropDown(false)}
        value={diets}
        setValue={setDiets}
        list={dietList}
        multiSelect
      />

      <Button
        mode='contained'
        uppercase={false}
        color='#F6AE2D'
        style={styles.button}
        labelStyle={{ color: 'white' }}
        onPress={handleSubmit(onSubmit)}
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
})

export default SearchForm
