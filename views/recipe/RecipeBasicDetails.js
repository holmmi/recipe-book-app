import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Avatar, Caption, Text } from 'react-native-paper'
import PropTypes from 'prop-types'
import { getUserAvatar } from '../../hooks/ApiHooks'
import { useTranslation } from 'react-i18next'
import Input from '../../components/Input'
import Tags from '../../components/Tags'
import diets from '../../constants/diets'
import TagInput from '../../components/TagInput'

const mediaUploads = 'https://media.mw.metropolia.fi/wbma/uploads/'

const rules = {
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

const RecipeBasicDetails = ({
  basicDetails,
  control,
  editMode,
  getValues,
  setValue,
}) => {
  const [authorAvatar, setAuthorAvatar] = useState(null)
  const { t } = useTranslation()

  useEffect(() => {
    const loadAuthorAvatar = async () => {
      setAuthorAvatar(await getUserAvatar(basicDetails?.authorDetails?.user_id))
    }
    loadAuthorAvatar()
  }, [])

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarContainer}>
        {authorAvatar && (
          <Avatar.Image
            size={120}
            style={styles.avatar}
            source={{ uri: `${mediaUploads}${authorAvatar.thumbnails.w320}` }}
          />
        )}
        <Text style={styles.usernameText}>
          {basicDetails?.authorDetails?.username}
        </Text>
      </View>
      <View style={styles.detailsContainer}>
        {editMode && (
          <Input
            name='recipeName'
            label={t('form.newRecipe.recipeNameLabel')}
            control={control}
            rules={rules.recipeName}
          />
        )}
      </View>
      <View style={styles.detailsContainer}>
        {!editMode ? (
          <>
            <Caption style={styles.caption}>
              {t('recipe.preparationTime')}
            </Caption>
            <Text>{basicDetails.preparationTime}</Text>
          </>
        ) : (
          <Input
            name='preparationTime'
            label={t('form.newRecipe.preparationTimeLabel')}
            control={control}
            rules={rules.preparationTime}
          />
        )}
      </View>
      <View style={styles.detailsContainer}>
        {!editMode ? (
          <>
            <Caption style={styles.caption}>{t('recipe.doseAmount')}</Caption>
            <Text>{basicDetails.doseAmount}</Text>
          </>
        ) : (
          <Input
            name='doseAmount'
            label={t('form.newRecipe.doseAmountLabel')}
            control={control}
            rules={rules.doseAmount}
          />
        )}
      </View>
      <View style={styles.detailsContainer}>
        {!editMode ? (
          <>
            <Caption style={styles.caption}>{t('recipe.diets')}</Caption>
            <Tags tags={basicDetails.diets} dataSource={diets} />
          </>
        ) : (
          <TagInput
            name='diets'
            dataSource={diets}
            defaultValue={getValues('diets')}
            setValue={setValue}
            label={t('recipe.diets')}
          />
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  avatar: {
    margin: 20,
  },
  avatarContainer: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  detailsContainer: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  usernameText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  tagInputContainer: {
    flex: 1,
  },
})

RecipeBasicDetails.propTypes = {
  basicDetails: PropTypes.object,
  control: PropTypes.any,
  editMode: PropTypes.bool,
  getValues: PropTypes.func,
  setValue: PropTypes.func,
}

export default RecipeBasicDetails
