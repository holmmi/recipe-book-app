import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import { useForm } from 'react-hook-form'
import Input from './Input'
import FreeTagInput from './FreeTagInput'
import TagInput from './TagInput'
import diets from '../constants/diets'

const SearchForm = ({ navigation }) => {
  const { t } = useTranslation()
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      diets: [],
      preparationTime: '',
      recipeName: '',
      substances: [],
    },
  })

  const onSubmit = (data) => {
    navigation.navigate('SearchResults', data)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Input
        control={control}
        label={t('form.search.recipeName')}
        name='recipeName'
      />

      <FreeTagInput
        label={t('form.search.substances')}
        name='substances'
        setValue={setValue}
      />

      <TagInput
        name='diets'
        dataSource={diets}
        label={t('form.search.diets')}
        setValue={setValue}
      />

      <Input
        control={control}
        label={t('form.search.preparationTime')}
        name='preparationTime'
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
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 100,
  },
})

SearchForm.propTypes = {
  navigation: PropTypes.object.isRequired,
}

export default SearchForm
