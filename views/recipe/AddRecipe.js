import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Button,
  Dialog,
  IconButton,
  Paragraph,
  Portal,
} from 'react-native-paper'
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
        instructions: [{ text: '' }],
        substances: [{ amount: '', unit: '', substance: '' }],
        media: [],
      },
    })
  const { t } = useTranslation()
  const [stepHasErrors, setStepHasErrors] = useState(false)
  const [uploadStatus, setUploadStatus] = useState({
    uploadStarted: false,
    isUploaded: false,
  })

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon='chevron-left'
          color='white'
          onPress={() => navigation.goBack()}
        />
      ),
    })
  }, [])

  const onNextProgressStep = async (validatableFields) => {
    setStepHasErrors(!(await trigger(validatableFields)))
  }

  const onSubmit = async (data) => {
    setUploadStatus({ ...uploadStatus, uploadStarted: true })

    const mediaUris = data.media.map((item) => item.uri)
    const fileIds =
      mediaUris.length > 0 ? await uploadMultipleFiles(mediaUris) : []
    const description = {
      recipeName: data.recipeName,
      preparationTime: data.preparationTime,
      doseAmount: data.doseAmount,
      diets: data.diets,
      substances: data.substances,
      instructions: data.instructions,
      media: fileIds,
    }
    const result = await uploadFileWithDescriptionAndTag(
      data.coverPhoto,
      JSON.stringify(description),
      'recipe-book'
    )

    if (result) {
      setUploadStatus({
        ...uploadStatus,
        uploadStarted: true,
        isUploaded: true,
      })
    }
  }

  const uploadReady = () => {
    setUploadStatus({
      ...uploadStatus,
      uploadStarted: false,
      isUploaded: false,
    })
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <Portal>
        <Dialog dismissable={false} visible={uploadStatus.uploadStarted}>
          <Dialog.Title>{t('common.dialog.notification')}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              {!uploadStatus.isUploaded
                ? t('common.dialog.uploadingData')
                : t('common.dialog.uploadReady')}
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              compact={true}
              mode='contained'
              disabled={!uploadStatus.isUploaded}
              loading={!uploadStatus.isUploaded}
              color='#F6AE2D'
              labelStyle={{ color: 'white' }}
              style={styles.button}
              onPress={uploadReady}
            >
              {t('common.ok')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

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
  button: {
    borderRadius: 100,
  },
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
