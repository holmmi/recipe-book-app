import React, { useContext, useEffect, useState } from 'react'
import { Platform, StyleSheet, View, TouchableOpacity } from 'react-native'
import { Avatar, Title, Paragraph, Button } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native'
import PropTypes from 'prop-types'
import { MainContext } from '../context/MainProvider'
import {
  checkIfUsernameExists,
  deleteFile,
  getFavouritesByUser,
  getLikesByUser,
  getPublicationsByUserAndTag,
  getUserAvatar,
} from '../hooks/ApiHooks'
import { useTranslation } from 'react-i18next'
import * as ImagePicker from 'expo-image-picker'
import Input from './Input'
import tags from '../constants/tags'

const mediaUploads = 'http://media.mw.metropolia.fi/wbma/uploads/'

const ProfileDetails = ({
  editMode,
  changeAvatar,
  setChangeAvatar,
  control,
  register,
  setValue,
  unregister,
}) => {
  const { isLogged, userDetails } = useContext(MainContext)
  const [avatarFile, setAvatarFile] = useState(null)
  const [tempAvatar, setTempAvatar] = useState(null)
  const [statistics, setStatistics] = useState({
    favourites: 0,
    likes: 0,
    publications: 0,
  })
  const { t } = useTranslation()

  useEffect(() => {
    const findUserAvatar = async () => {
      setAvatarFile(await getUserAvatar(userDetails.user_id))
    }
    if (tempAvatar) {
      setTempAvatar(false)
      setTimeout(() => {
        findUserAvatar()
      }, 1000)
    } else {
      findUserAvatar()
    }
  }, [editMode, userDetails, changeAvatar])

  useFocusEffect(() => {
    const getStatistics = async () => {
      setStatistics({
        favourites: (await getFavouritesByUser()).length,
        likes: (await getLikesByUser()).length,
        publications: (
          await getPublicationsByUserAndTag(userDetails.user_id, tags.recipes)
        ).length,
      })
    }
    if (isLogged) {
      getStatistics()
    }
  })

  const getUserInitials = () => {
    if (userDetails?.full_name) {
      const nameParts = userDetails.full_name.split(' ')
      let initials = ''
      nameParts.forEach((namePart) => {
        initials += namePart.charAt(0).toUpperCase()
      })
      return initials.length > 0 ? initials : '--'
    }
    return '--'
  }

  const chooseAvatar = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync()
        if (!result.cancelled) {
          register('file')
          setValue('file', result.uri)
          setTempAvatar(result.uri)
        }
      }
    }
  }

  const deleteAvatar = async () => {
    if (tempAvatar) {
      setTempAvatar(null)
      unregister('file')
    } else {
      const result = await deleteFile(avatarFile.file_id)
      if (result) {
        setAvatarFile(null)
      }
    }
  }

  const rules = {
    fullName: {
      required: false,
    },
    email: {
      required: {
        value: true,
        message: 'form.register.emailRequired',
      },
      pattern: {
        value: /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/,
        message: 'form.register.emailInvalid',
      },
    },
    username: {
      validate: {
        length: (value) =>
          value.length >= 5 || 'form.register.usernameTooShort',
        usernameNotExists: async (value) => {
          if (value !== userDetails.username) {
            return (
              (await checkIfUsernameExists(value)) ||
              'form.register.usernameTaken'
            )
          }
          return true
        },
      },
    },
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={() => setChangeAvatar(!changeAvatar)}>
          {avatarFile || tempAvatar ? (
            <Avatar.Image
              size={128}
              source={{
                uri: tempAvatar
                  ? tempAvatar
                  : `${mediaUploads}${avatarFile.thumbnails.w320}`,
              }}
            />
          ) : (
            <Avatar.Text
              size={128}
              color='white'
              style={styles.textAvatar}
              label={getUserInitials()}
            />
          )}
        </TouchableOpacity>
        {(editMode || changeAvatar) && (
          <View style={styles.avatarButtonContainer}>
            <Button
              mode='contained'
              icon='camera'
              color='#F6AE2D'
              compact={true}
              labelStyle={{ color: 'white' }}
              style={styles.avatarButton}
              disabled={avatarFile}
              onPress={chooseAvatar}
            >
              {t('avatar.choose')}
            </Button>
            <Button
              mode='contained'
              icon='close'
              color='#F6AE2D'
              compact={true}
              labelStyle={{ color: 'white' }}
              style={styles.avatarButton}
              disabled={!tempAvatar && !avatarFile}
              onPress={deleteAvatar}
            >
              {t('avatar.delete')}
            </Button>
          </View>
        )}
      </View>
      <View style={styles.basicInformationContainer}>
        <Title style={styles.title}>{t('profile.username')}</Title>
        {editMode ? (
          <View style={styles.inputContainer}>
            <Input
              name='username'
              control={control}
              defaultValue={userDetails.username}
              label={t('form.register.usernameLabel')}
              rules={rules.username}
            />
          </View>
        ) : (
          <Paragraph>{userDetails.username}</Paragraph>
        )}
      </View>
      <View style={styles.basicInformationContainer}>
        <Title style={styles.title}>{t('profile.name')}</Title>
        {editMode ? (
          <View style={styles.inputContainer}>
            <Input
              name='full_name'
              control={control}
              defaultValue={userDetails.full_name}
              label={t('form.register.fullNameLabel')}
              rules={rules.fullName}
            />
          </View>
        ) : (
          <Paragraph>{userDetails.full_name}</Paragraph>
        )}
      </View>
      <View style={styles.basicInformationContainer}>
        <Title style={styles.title}>{t('profile.email')}</Title>
        {editMode ? (
          <View style={styles.inputContainer}>
            <Input
              name='email'
              control={control}
              defaultValue={userDetails.email}
              label={t('form.register.emailLabel')}
              rules={rules.email}
            />
          </View>
        ) : (
          <Paragraph>{userDetails.email}</Paragraph>
        )}
      </View>
      <View style={styles.socialContainer}>
        <View style={styles.socialItem}>
          <Title style={styles.title}>{t('profile.publications')}</Title>
          <Paragraph>{statistics.publications}</Paragraph>
        </View>
        <View style={styles.socialItem}>
          <Title style={styles.title}>{t('profile.favorites')}</Title>
          <Paragraph>{statistics.favourites}</Paragraph>
        </View>
        <View style={styles.socialItem}>
          <Title style={styles.title}>{t('profile.likes')}</Title>
          <Paragraph>{statistics.likes}</Paragraph>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButton: {
    margin: 10,
    borderRadius: 100,
  },
  textAvatar: {
    backgroundColor: 'tomato',
  },
  basicInformationContainer: {
    flex: 0,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#ccc',
  },
  socialContainer: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialItem: {
    flexBasis: '33.3%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    width: '100%',
  },
})

ProfileDetails.propTypes = {
  editMode: PropTypes.bool,
  changeAvatar: PropTypes.bool,
  setChangeAvatar: PropTypes.func,
  control: PropTypes.any,
  register: PropTypes.func,
  setValue: PropTypes.func,
  unregister: PropTypes.func,
}

export default ProfileDetails
