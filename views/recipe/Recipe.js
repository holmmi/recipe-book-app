import React, { useContext, useLayoutEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Button,
  Dialog,
  IconButton,
  Paragraph,
  Portal,
} from 'react-native-paper'
import PropTypes from 'prop-types'
import { MainContext } from '../../context/MainProvider'
import { useTranslation } from 'react-i18next'
import { deleteFile } from '../../hooks/ApiHooks'
import Tabs from '../../components/Tabs'
import RecipeBasicDetails from './RecipeBasicDetails'
import RecipeCard from '../../components/RecipeCard'

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
  const { media } = JSON.parse(route.params?.description)

  const { isLogged, userDetails } = useContext(MainContext)
  const [editMode, setEditMode] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [activeTab, setActiveTab] = useState('basicDetails')
  const { t } = useTranslation()

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
              <IconButton
                icon='pencil'
                color='white'
                style={styles.authorActions}
              />
              <IconButton
                icon='delete'
                color='white'
                style={styles.authorActions}
                onPress={() => setShowConfirmation(true)}
              />
            </>
          )}
        </>
      ),
    })
  }, [])

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
    basicDetails: () => <RecipeBasicDetails dataItem={route.params} />,
  }

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
      <View style={styles.tabContainer}>
        <Tabs
          defaultValue='basicDetails'
          onValueChange={(value) => setActiveTab(value)}
          tabs={tabs}
        />
      </View>
      {tabViews[activeTab]()}
      <RecipeCard dataItem={route.params}></RecipeCard>
    </View>
  )
}

const styles = StyleSheet.create({
  authorActions: {
    marginRight: 5,
  },
  container: {
    flex: 1,
    padding: 10,
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
