import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { Headline, Button } from 'react-native-paper'
import { useForm } from 'react-hook-form'
import Input from './Input'
import { apiLogin } from '../hooks/ApiHooks'
import { MainContext } from '../context/MainProvider'
import PropTypes from 'prop-types'

const LoginForm = ({ showError, switchForm }) => {
  const { setIsLogged, setUserDetails } = useContext(MainContext)
  const { t } = useTranslation()
  const { control, handleSubmit } = useForm()

  const onSubmit = async (data) => {
    const userDetails = await apiLogin(data)
    if (userDetails) {
      setIsLogged(true)
      setUserDetails(userDetails)
    } else {
      showError(t('form.login.invalidCredentials'))
    }
  }

  return (
    <>
      <Headline style={styles.headline}>{t('account.login')}</Headline>
      <Input
        name='username'
        control={control}
        label={t('form.login.usernameLabel')}
        rules={{
          required: { value: true, message: 'form.login.usernameMissing' },
        }}
      />
      <Input
        name='password'
        control={control}
        label={t('form.login.passwordLabel')}
        secureTextEntry={true}
        rules={{
          required: { value: true, message: 'form.login.passwordMissing' },
        }}
      />
      <Button
        mode='contained'
        uppercase={false}
        color='#F6AE2D'
        style={styles.button}
        labelStyle={{ color: 'white' }}
        onPress={handleSubmit(onSubmit)}
      >
        {t('form.login.loginButton')}
      </Button>
      <Button
        uppercase={false}
        color='#F6AE2D'
        style={styles.button}
        onPress={switchForm}
      >
        {t('form.login.noAccount')}
      </Button>
    </>
  )
}

const styles = StyleSheet.create({
  headline: {
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 100,
  },
})

LoginForm.propTypes = {
  showError: PropTypes.func,
  switchForm: PropTypes.func,
}

export default LoginForm
