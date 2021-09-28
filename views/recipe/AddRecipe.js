import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Dialog } from 'react-native-paper'
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps'
import { useForm } from 'react-hook-form'
import RecipeBasicDetails from '../../components/RecipeBasicDetails'
import { useTranslation } from 'react-i18next'
import RecipeSubstances from '../../components/RecipeSubstances'
import RecipeInstructions from '../../components/RecipeInstructions'
import {
  uploadFileWithDescriptionAndTag,
  uploadMultipleFiles,
} from '../../hooks/ApiHooks'

const AddRecipe = ({ navigation }) => {
  const { control, trigger, handleSubmit, register, setValue, getValues } =
    useForm({
      defaultValues: {
        coverPhoto: null,
        diets: [],
        instructions: [''],
        substances: [{ amount: '', unit: '', substance: '' }],
        media: [],
      },
    })
  const { t } = useTranslation()
  const [stepHasErrors, setStepHasErrors] = useState(false)

  const onNextProgressStep = async (validatableFields) => {
    setStepHasErrors(!(await trigger(validatableFields)))
  }

  const onSubmit = async (data) => {
    const mediaUris = data.media.map((item) => item.uri)
    const fileIds = await uploadMultipleFiles(mediaUris)
    const description = {
      recipeName: data.recipeName,
      preparationTime: data.preparationTime,
      doseAmount: data.doseAmount,
      diets: data.diets,
      substances: data.substances,
      instructions: data.instructions,
      media: fileIds,
    }
    console.log(JSON.stringify(description))
    const result = await uploadFileWithDescriptionAndTag(
      data.coverPhoto,
      JSON.stringify(description),
      'recipe-book-app'
    )
  }

  return (
    <View style={styles.container}>
      <ProgressSteps
        activeLabelColor='#F6AE2D'
        activeStepIconBorderColor='#F6AE2D'
        activeStepNumColor='#F6AE2D'
        completedProgressBarColor='#F6AE2D'
        completedStepIconColor='#F6AE2D'
        progressBarColor='#ccc'
      >
        <ProgressStep
          label={t('progress.newRecipe.basicDetails')}
          nextBtnText={t('progress.nextButton')}
          onNext={() =>
            onNextProgressStep([
              'recipeName',
              'preparationTime',
              'doseAmount',
              'coverPhoto',
            ])
          }
          errors={stepHasErrors}
          nextBtnTextStyle={styles.progressStepButton}
        >
          <RecipeBasicDetails
            control={control}
            register={register}
            setValue={setValue}
            getValues={getValues}
          />
        </ProgressStep>
        <ProgressStep
          label={t('progress.newRecipe.substances')}
          nextBtnText={t('progress.nextButton')}
          previousBtnText={t('progress.previousButton')}
          onNext={() => onNextProgressStep(['substances'])}
          errors={stepHasErrors}
          nextBtnTextStyle={styles.progressStepButton}
          previousBtnTextStyle={styles.progressStepButton}
        >
          <RecipeSubstances name='substances' control={control} />
        </ProgressStep>
        <ProgressStep
          label={t('progress.newRecipe.instructions')}
          finishBtnText={t('progress.finishButton')}
          previousBtnText={t('progress.previousButton')}
          onNext={() => onNextProgressStep(['substances'])}
          errors={stepHasErrors}
          nextBtnTextStyle={styles.progressStepButton}
          previousBtnTextStyle={styles.progressStepButton}
          onSubmit={handleSubmit(onSubmit)}
        >
          <RecipeInstructions control={control} name='instructions' />
        </ProgressStep>
      </ProgressSteps>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  progressStepButton: {
    textAlign: 'center',
    color: '#F6AE2D',
    fontWeight: 'bold',
  },
})

export default AddRecipe
