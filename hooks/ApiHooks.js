import * as SecureStore from 'expo-secure-store'

const apiBaseUrl = 'https://media.mw.metropolia.fi/wbma'

const apiLogin = async (data) => {
  try {
    const response = await fetch(`${apiBaseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    let userDetails
    if (response.ok) {
      const json = await response.json()
      await SecureStore.setItemAsync('userToken', json.token)
      userDetails = json.user
    }
    return userDetails
  } catch (error) {
    throw error
  }
}

const getCurrentUser = async () => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken')
    let userDetails
    if (userToken) {
      const response = await fetch(`${apiBaseUrl}/users/user`, {
        headers: {
          'x-access-token': userToken,
        },
      })
      if (response.ok) {
        userDetails = await response.json()
      } else {
        await SecureStore.deleteItemAsync('userToken')
      }
    }
    return userDetails
  } catch (error) {
    throw error
  }
}

const checkIfUsernameExists = async (username) => {
  try {
    const response = await fetch(`${apiBaseUrl}/users/username/${username}`)
    if (response.ok) {
      const json = await response.json()
      return json.available
    }
    return false
  } catch (error) {
    throw error
  }
}

const createUser = async (data) => {
  try {
    const response = await fetch(`${apiBaseUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.ok
  } catch (error) {
    throw error
  }
}

export { apiLogin, getCurrentUser, checkIfUsernameExists, createUser }
