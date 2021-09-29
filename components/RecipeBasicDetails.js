import React from 'react'
import { useTranslation } from 'react-i18next'
import diets from '../constants/diets'
import Input from './Input'
import TagInput from './TagInput'
import SingleImage from './SingleImage'

const rules = {
  coverPhoto: {
    required: {
      value: true,
      message: 'form.newRecipe.coverPhotoMissing',
    },
  },
  doseAmount: {
    required: {
      value: true,
      message: 'form.newRecipe.doseAmountMissing',
    },
    pattern: {
      value: /^\d+$/,
      message: 'form.newRecipe.doseAmountAsNumber',
    },
  },
  preparationTime: {
    required: {
      value: true,
      message: 'form.newRecipe.preparationTimeMissing',
    },
    pattern: {
      value: /^\d+$/,
      message: 'form.newRecipe.preparationTimeAsNumber',
    },
  },
  recipeName: {
    required: {
      value: true,
      message: 'form.newRecipe.recipeNameMissing',
    },
  },
}

const RecipeBasicDetails = ({ control, register, setValue, getValues }) => {
  const { t } = useTranslation()

  return (
    <>
      <Input
        name='recipeName'
        label={t('form.newRecipe.recipeNameLabel')}
        control={control}
        rules={rules.recipeName}
      />
      <Input
        name='preparationTime'
        label={t('form.newRecipe.preparationTimeLabel')}
        control={control}
        rules={rules.preparationTime}
      />
      <Input
        name='doseAmount'
        label={t('form.newRecipe.doseAmountLabel')}
        control={control}
        rules={rules.doseAmount}
      />
      <TagInput
        name='diets'
        label={t('form.newRecipe.dietsLabel')}
        register={register}
        setValue={setValue}
        dataSource={diets}
        defaultValue={getValues('diets')}
      />
      <SingleImage
        name='coverPhoto'
        control={control}
        rules={rules.coverPhoto}
        label={t('form.newRecipe.chooseCoverPhoto')}
        setValue={setValue}
        fileUri={getValues('coverPhoto')}
      />
    </>
  )
}

export default RecipeBasicDetails
