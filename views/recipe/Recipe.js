import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  ActivityIndicator,
  Button,
  Dialog,
  IconButton,
  Paragraph,
  Portal,
} from 'react-native-paper'
import PropTypes from 'prop-types'
import { MainContext } from '../../context/MainProvider'
import { useTranslation } from 'react-i18next'
import {
  deleteFile,
  deleteMultipleFiles,
  updateFileDescription,
  uploadMultipleFiles,
} from '../../hooks/ApiHooks'
import Tabs from '../../components/Tabs'
import RecipeBasicDetails from './RecipeBasicDetails'
import RecipeCard from '../../components/RecipeCard'
import { useForm } from 'react-hook-form'
import RecipeSubstances from './RecipeSubstances'
import RecipeInstructions from './RecipeInstructions'

const tabs = [
  {
    label: 'tabs.recipe.basicDetails',
    value: 'basicDetails',
  },
  {
    label: 'tabs.recipe.substances',
    value: 'substances',
  },
  {
    label: 'tabs.recipe.instructions',
    value: 'instructions',
  },
]

const Recipe = ({ navigation, route }) => {
  const {
    authorDetails,
    recipeName,
    preparationTime,
    doseAmount,
    diets,
    substances,
    instructions,
    media,
  } = JSON.parse(route.params?.description)

  const { isLogged, userDetails, isKeyboardVisible } = useContext(MainContext)
  const [editMode, setEditMode] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('basicDetails')
  const { t } = useTranslation()
  const [recipeValues, setRecipeValues] = useState({
    authorDetails,
    recipeName,
    preparationTime,
    doseAmount,
    diets,
    substances,
    instructions,
    existingMedia: [...media],
    media: [],
  })
  const { control, handleSubmit, getValues, reset, setValue } = useForm({
    defaultValues: {
      ...recipeValues,
    },
  })
  const filename = route.params.filename

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon='chevron-left'
          color='white'
          onPress={() => navigation.goBack()}
        />
      ),
      headerRight: () => (
        <>
          {isLogged && userDetails?.user_id === route?.params?.user_id && (
            <>
              {isSaving ? (
                <ActivityIndicator
                  color='white'
                  style={styles.activityIndicator}
                />
              ) : (
                <>
                  {!editMode ? (
                    <>
                      <IconButton
                        icon='pencil'
                        color='white'
                        style={styles.authorActions}
                        onPress={() => setEditMode(true)}
                      />
                      <IconButton
                        icon='delete'
                        color='white'
                        style={styles.authorActions}
                        onPress={() => setShowConfirmation(true)}
                      />
                    </>
                  ) : (
                    <>
                      <IconButton
                        icon='close-circle-outline'
                        color='white'
                        style={styles.authorActions}
                        onPress={onResetForm}
                      />
                      <IconButton
                        icon='content-save'
                        color='white'
                        style={styles.authorActions}
                        onPress={handleSubmit(onSaveRecipe)}
                      />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      ),
    })
  }, [editMode, isSaving])

  const deleteRecipe = async () => {
    const fileIds = [...media, route.params.file_id]
    const results = await Promise.all(
      fileIds.map(async (fileId) => await deleteFile(fileId))
    )
    if (results.every((result) => result === true)) {
      setShowConfirmation(false)
      navigation.navigate('Recipes', { refresh: route.params.file_id })
    }
  }

  const tabViews = {
    basicDetails: () => {
      const { authorDetails, recipeName, preparationTime, diets, doseAmount } =
        recipeValues
      return (
        <RecipeBasicDetails
          basicDetails={{
            authorDetails,
            recipeName,
            preparationTime,
            diets,
            doseAmount,
          }}
          control={control}
          editMode={editMode}
          getValues={getValues}
          setValue={setValue}
        />
      )
    },
    instructions: () => (
      <RecipeInstructions
        control={control}
        editMode={editMode}
        instructions={recipeValues.instructions}
        existingMedia={recipeValues.existingMedia}
      />
    ),
    substances: () => (
      <RecipeSubstances
        control={control}
        editMode={editMode}
        substances={recipeValues.substances}
      />
    ),
  }

  const onResetForm = () => {
    reset({ ...recipeValues })
    setEditMode(false)
  }

  const onSaveRecipe = async (data) => {
    setIsSaving(true)
    const newFiles = data.media.filter(
      (item) => !item.removed && item?.uri.startsWith('file')
    )
    const newFileIds = await uploadMultipleFiles(
      newFiles.map((newFile) => newFile.uri)
    )
    const removedFiles = data.media.filter(
      (item) => item.removed && item?.fileId
    )
    await deleteMultipleFiles(
      removedFiles.map((removedFile) => removedFile.fileId)
    )
    const existingFileIds = data.media
      .filter((item) => !item.removed && item?.fileId)
      .map((existingFileId) => existingFileId.fileId)

    const updatableDetails = {
      ...data,
      media: [...existingFileIds, ...newFileIds],
      authorDetails: { ...userDetails },
    }
    delete updatableDetails.existingMedia

    if (
      await updateFileDescription(
        route.params.file_id,
        JSON.stringify(updatableDetails)
      )
    ) {
      setEditMode(false)
      setRecipeValues({
        ...data,
        existingMedia: [...existingFileIds, ...newFileIds],
        media: [],
        authorDetails: { ...userDetails },
      })
    }
  }

  useEffect(() => {
    reset({ ...recipeValues })
    setIsSaving(false)
  }, [recipeValues])

  return (
    <View style={styles.container}>
      <Portal>
        <Dialog
          visible={showConfirmation}
          onDismiss={() => setShowConfirmation(false)}
        >
          <Dialog.Title>{t('common.dialog.notification')}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{t('recipe.deleteConfirmation')}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button compact={true} color='#F6AE2D' onPress={deleteRecipe}>
              {t('common.ok')}
            </Button>
            <Button
              compact={true}
              color='#F6AE2D'
              onPress={() => setShowConfirmation(false)}
            >
              {t('common.cancel')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {!isKeyboardVisible && (
        <>
          <View style={styles.tabContainer}>
            <Tabs
              defaultValue='basicDetails'
              onValueChange={(value) => setActiveTab(value)}
              tabs={tabs}
            />
          </View>
          <RecipeCard
            dataItem={{
              recipeName,
              media,
              filename,
              fileId: route.params?.file_id,
            }}
          ></RecipeCard>
        </>
      )}

      {tabViews[activeTab]()}
    </View>
  )
}

const styles = StyleSheet.create({
  activityIndicator: {
    marginRight: 5,
  },
  authorActions: {
    marginRight: 5,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

Recipe.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
}

export default Recipe
