import React from 'react'
import { StyleSheet } from 'react-native'
import { useForm } from 'react-hook-form'
import { Headline, Button } from 'react-native-paper'
import Input from './Input'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { checkIfUsernameExists, createUser } from '../hooks/ApiHooks'

const RegisterForm = ({ showError, switchForm }) => {
  const { control, handleSubmit, getValues } = useForm()
  const { t } = useTranslation()

  const rules = {
    fullName: {
      required: false,
    },
    username: {
      validate: {
        length: (value) =>
          value.length >= 5 || 'form.register.usernameTooShort',
        usernameNotExists: async (value) =>
          (await checkIfUsernameExists(value)) || 'form.register.usernameTaken',
      },
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
    password: {
      required: {
        value: true,
        message: 'form.register.passwordRequired',
      },
      minLength: {
        value: 5,
        message: 'form.register.passwordTooShort',
      },
    },
    verifyPassword: {
      validate: (value) =>
        value === getValues('password') || 'form.register.passwordsNotMatching',
    },
  }

  const onSubmit = async (data) => {
    const friendlyData = { ...data }
    delete friendlyData['verifyPassword']
    const status = await createUser(friendlyData)
    if (status) {
      switchForm()
      showError(t('form.register.success'))
    } else {
      showError(t('form.register.error'))
    }
  }

  return (
    <>
      <Headline style={styles.headline}>{t('account.register')}</Headline>
      <Input
        name='full_name'
        label={t('form.register.fullNameLabel')}
        control={control}
        rules={rules.fullName}
      />
      <Input
        name='username'
        label={t('form.register.usernameLabel')}
        control={control}
        rules={rules.username}
      />
      <Input
        name='email'
        label={t('form.register.emailLabel')}
        control={control}
        rules={rules.email}
      />
      <Input
        name='password'
        label={t('form.register.passwordLabel')}
        secureTextEntry={true}
        control={control}
        rules={rules.password}
      />
      <Input
        name='verifyPassword'
        label={t('form.register.verifyPasswordLabel')}
        secureTextEntry={true}
        control={control}
        rules={rules.verifyPassword}
      />
      <Button
        mode='contained'
        uppercase={false}
        color='#F6AE2D'
        style={styles.button}
        labelStyle={{ color: 'white' }}
        onPress={handleSubmit(onSubmit)}
      >
        {t('form.register.submit')}
      </Button>
      <Button
        uppercase={false}
        color='#F6AE2D'
        style={styles.button}
        onPress={switchForm}
      >
        {t('account.alreadyAccount')}
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

RegisterForm.propTypes = {
  showError: PropTypes.func,
  switchForm: PropTypes.func,
}

export default RegisterForm
