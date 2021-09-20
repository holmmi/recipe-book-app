import { useIsFocused } from '@react-navigation/core'
import React, { useLayoutEffect, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { Button, Portal, Modal, Dialog, Paragraph } from 'react-native-paper'
import LoginForm from '../../components/LoginForm'
import { MainContext } from '../../context/MainProvider'
import * as SecureStore from 'expo-secure-store'
import RegisterForm from '../../components/RegisterForm'

const Profile = ({ navigation }) => {
  const { isLogged, setIsLogged } = useContext(MainContext)

  const isFocused = useIsFocused()

  const [showLoginForm, setShowLoginForm] = useState(true)
  const [showErrorDialog, setShowErrorDialog] = useState({
    visible: false,
    message: '',
  })

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

  const { t } = useTranslation()

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken')
      setIsLogged(false)
    } catch (error) {
      throw error
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.logoutButtonContainer}>
          <Button
            icon='logout'
            mode='text'
            uppercase={false}
            color='white'
            onPress={logout}
          >
            {t('account.logout')}
          </Button>
        </View>
      ),
    })
  }, [navigation])

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
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
