import { useIsFocused } from '@react-navigation/core'
import React, { useLayoutEffect, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ScrollView } from 'react-native'
import {
  Button,
  Portal,
  Modal,
  Dialog,
  Paragraph,
  IconButton,
} from 'react-native-paper'
import LoginForm from '../../components/LoginForm'
import { MainContext } from '../../context/MainProvider'
import * as SecureStore from 'expo-secure-store'
import RegisterForm from '../../components/RegisterForm'
import ProfileDetails from '../../components/ProfileDetails'
import { useForm } from 'react-hook-form'
import { updateUserDetails, uploadImageWithTag } from '../../hooks/ApiHooks'

const Profile = ({ navigation }) => {
  const { isLogged, setIsLogged, setUpdateUserDetails } =
    useContext(MainContext)
  const isFocused = useIsFocused()
  const [showLoginForm, setShowLoginForm] = useState(true)
  const [showErrorDialog, setShowErrorDialog] = useState({
    visible: false,
    message: '',
  })
  const [editMode, setEditMode] = useState(false)
  const { t } = useTranslation()
  const { control, handleSubmit, register, reset, setValue, unregister } =
    useForm()

  const switchForm = () => {
    setShowLoginForm(!showLoginForm)
  }

  const showError = (message) => {
    setShowErrorDialog({
      ...showErrorDialog,
      visible: true,
      message: message,
    })
  }

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken')
      setIsLogged(false)
    } catch (error) {
      throw error
    }
  }

  const updateProfile = async (data) => {
    const { email, file, full_name, username } = data
    setUpdateUserDetails(
      await updateUserDetails({ email, full_name, username })
    )
    if (file) {
      await uploadImageWithTag('avatar', file, 'Avatar')
    }
    setEditMode(false)
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRight}>
          <IconButton
            icon={editMode ? 'close-circle-outline' : 'pencil'}
            color='white'
            onPress={() => {
              setEditMode(!editMode)
              reset()
            }}
          />
          {editMode && (
            <IconButton
              icon='content-save-outline'
              color='white'
              onPress={handleSubmit(updateProfile)}
            />
          )}
          <IconButton icon='logout-variant' color='white' onPress={logout} />
        </View>
      ),
    })
  }, [navigation, editMode])

  return (
    <ScrollView style={styles.container}>
      <Portal>
        <Modal
          visible={!isLogged && isFocused}
          onDismiss={() => navigation.goBack()}
          style={styles.modal}
          contentContainerStyle={styles.modalContainer}
        >
          {showLoginForm ? (
            <LoginForm showError={showError} switchForm={switchForm} />
          ) : (
            <RegisterForm showError={showError} switchForm={switchForm} />
          )}
        </Modal>
        <Dialog visible={showErrorDialog.visible}>
          <Dialog.Title>{t('error.notification')}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{showErrorDialog.message}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode='contained'
              compact={true}
              labelStyle={{ color: 'white' }}
              onPress={() =>
                setShowErrorDialog({ ...showErrorDialog, visible: false })
              }
            >
              {t('common.ok')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {isLogged && (
        <ProfileDetails
          editMode={editMode}
          control={control}
          register={register}
          setValue={setValue}
          unregister={unregister}
        />
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ccc',
  },
  headerRight: {
    flexDirection: 'row',
    marginRight: 10,
  },
  logoutButtonContainer: {
    marginRight: 10,
  },
  modal: {
    justifyContent: 'flex-start',
  },
  modalContainer: {
    justifyContent: 'flex-start',
    minHeight: '80%',
    marginLeft: 10,
    marginRight: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
})

export default Profile
