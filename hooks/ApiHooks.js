import * as SecureStore from 'expo-secure-store'
import { getFileMimeType, getFileSuffix } from '../utils/imageUtil'

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

const getUserAvatar = async (userId) => {
  try {
    const avatarResponse = await fetch(`${apiBaseUrl}/tags/avatar`)
    let thumbnails
    if (avatarResponse.ok) {
      const avatarJson = await avatarResponse.json()
      const userAvatarFile = avatarJson.filter(
        (avatar) => avatar.user_id === userId && avatar.media_type === 'image'
      )[0]
      if (userAvatarFile) {
        const fileDetailsResponse = await fetch(
          `${apiBaseUrl}/media/${userAvatarFile.file_id}`
        )
        if (fileDetailsResponse.ok) {
          thumbnails = await fileDetailsResponse.json()
        }
      }
    }
    return thumbnails
  } catch (error) {
    throw error
  }
}

const updateUserDetails = async (data) => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken')
    const response = await fetch(`${apiBaseUrl}/users`, {
      headers: {
        'x-access-token': userToken,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.ok
  } catch (error) {
    throw error
  }
}

const uploadImageWithTag = async (tag, file, title) => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken')
    const formData = new FormData()
    formData.append('file', {
      uri: file,
      type: getFileMimeType(file),
      name: `avatar${getFileSuffix(file)}`,
    })
    formData.append('title', title)
    const uploadResponse = await fetch(`${apiBaseUrl}/media`, {
      method: 'POST',
      headers: {
        'x-access-token': userToken,
      },
      body: formData,
    })
    if (uploadResponse.ok) {
      const uploadJson = await uploadResponse.json()
      const tagResponse = await fetch(`${apiBaseUrl}/tags`, {
        method: 'POST',
        headers: {
          'x-access-token': userToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_id: uploadJson.file_id,
          tag: tag,
        }),
      })
      return tagResponse.ok
    }
    return false
  } catch (error) {
    throw error
  }
}

const deleteFile = async (fileId) => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken')
    const response = await fetch(`${apiBaseUrl}/media/${fileId}`, {
      method: 'DELETE',
      headers: {
        'x-access-token': userToken,
      },
    })
    return response.ok
  } catch (error) {
    throw error
  }
}

export {
  apiLogin,
  getCurrentUser,
  checkIfUsernameExists,
  createUser,
  getUserAvatar,
  updateUserDetails,
  uploadImageWithTag,
  deleteFile,
}
