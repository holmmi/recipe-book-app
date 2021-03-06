import { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import { FileSystemUploadType, uploadAsync } from 'expo-file-system'
import tags from '../constants/tags'

const apiBaseUrl = 'https://media.mw.metropolia.fi/wbma'

const useLoadRecipes = (refresh) => {
  const [recipes, setRecipes] = useState([])
  const [pullRefresh, setPullRefresh] = useState(false)

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const tagResponse = await fetch(`${apiBaseUrl}/tags/${tags.recipes}`)
        if (tagResponse.ok) {
          const tagFiles = await tagResponse.json()
          const files = await Promise.all(
            tagFiles.map(async (tagFile) => {
              const fileResponse = await fetch(
                `${apiBaseUrl}/media/${tagFile.file_id}`
              )
              return await fileResponse.json()
            })
          )
          setRecipes(files.sort((a, b) => b.file_id - a.file_id))
        }
        setPullRefresh(false)
      } catch (error) {
        throw error
      }
    }
    if (pullRefresh || refresh) {
      setTimeout(() => {
        loadRecipes()
      }, 500)
    }
  }, [pullRefresh, refresh])

  return { recipes, pullRefresh, setPullRefresh }
}

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

const getUserDetails = async (userId) => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken')
    const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
      headers: {
        'x-access-token': userToken,
      },
    })
    if (response.ok) {
      return await response.json()
    }
    return null
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

const uploadSingleFile = async (uri) => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken')
    const date = new Date()
    const { status, body } = await uploadAsync(`${apiBaseUrl}/media`, uri, {
      headers: {
        'x-access-token': userToken,
      },
      httpMethod: 'POST',
      uploadType: FileSystemUploadType.MULTIPART,
      fieldName: 'file',
      parameters: {
        title: date.toString(),
      },
    })
    if (status === 200 || status === 201) {
      const json = JSON.parse(body)
      return json.file_id
    }
  } catch (error) {
    throw error
  }
}

const uploadMultipleFiles = async (uris) => {
  try {
    return await Promise.all(
      uris.map(async (uri) => await uploadSingleFile(uri))
    )
  } catch (error) {
    throw error
  }
}

const uploadFileWithDescriptionAndTag = async (uri, description, tag) => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken')
    const date = new Date()
    const { status, body } = await uploadAsync(`${apiBaseUrl}/media`, uri, {
      headers: {
        'x-access-token': userToken,
      },
      httpMethod: 'POST',
      uploadType: FileSystemUploadType.MULTIPART,
      fieldName: 'file',
      parameters: {
        title: date.toString(),
        description,
      },
    })
    if (status === 200 || status === 201) {
      const fileJson = JSON.parse(body)
      const tagResponse = await fetch(`${apiBaseUrl}/tags`, {
        method: 'POST',
        headers: {
          'x-access-token': userToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_id: fileJson.file_id,
          tag,
        }),
      })
      return tagResponse.ok
    }
    return false
  } catch (error) {
    throw error
  }
}

const uploadFileWithTag = async (tag, uri) => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken')
    const date = new Date()
    const { status, body } = await uploadAsync(`${apiBaseUrl}/media`, uri, {
      headers: {
        'x-access-token': userToken,
      },
      httpMethod: 'POST',
      uploadType: FileSystemUploadType.MULTIPART,
      fieldName: 'file',
      parameters: {
        title: date.toString(),
      },
    })
    if (status === 200 || status === 201) {
      const json = JSON.parse(body)
      const tagResponse = await fetch(`${apiBaseUrl}/tags`, {
        method: 'POST',
        headers: {
          'x-access-token': userToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_id: json.file_id,
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

const deleteMultipleFiles = async (fileIds) => {
  try {
    const results = await Promise.all(
      fileIds.map(async (fileId) => await deleteFile(fileId))
    )
    return results
  } catch (error) {
    throw error
  }
}

const updateFileDescription = async (fileId, data) => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken')
    const response = await fetch(`${apiBaseUrl}/media/${fileId}`, {
      headers: {
        'x-access-token': userToken,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({
        description: data,
      }),
    })
    return response.ok
  } catch (error) {
    throw error
  }
}

const getFileDetails = async (fileId) => {
  try {
    const response = await fetch(`${apiBaseUrl}/media/${fileId}`)
    if (response.ok) {
      return await response.json()
    }
    return null
  } catch (error) {
    throw error
  }
}

const getMultipleFileDetails = async (fileIds) => {
  try {
    return await Promise.all(
      fileIds.map(async (fileId) => await getFileDetails(fileId))
    )
  } catch (error) {
    throw error
  }
}

const getPublicationsByUserAndTag = async (userId, tag) => {
  try {
    const response = await fetch(`${apiBaseUrl}/tags/${tag}`)
    if (response.ok) {
      const files = await response.json()
      return files.filter((file) => file.user_id === userId)
    }
    return []
  } catch (error) {
    throw error
  }
}

const getLikesByUser = async () => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken')
    const response = await fetch(`${apiBaseUrl}/ratings`, {
      headers: {
        'x-access-token': userToken,
      },
    })
    if (response.ok) {
      return await response.json()
    }
    return []
  } catch (error) {
    throw error
  }
}

const addLike = async (fileId) => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken')
    const response = await fetch(`${apiBaseUrl}/ratings`, {
      method: 'POST',
      headers: {
        'x-access-token': userToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file_id: fileId, rating: 1 }),
    })
    return response.ok
  } catch (error) {
    throw error
  }
}

const deleteLike = async (fileId) => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken')
    const response = await fetch(`${apiBaseUrl}/ratings/file/${fileId}`, {
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

const getLikes = async (fileId) => {
  try {
    const response = await fetch(`${apiBaseUrl}/ratings/file/${fileId}`)
    if (response.ok) {
      return await response.json()
    }
    return []
  } catch (error) {
    throw error
  }
}

const getFavourites = async (fileId) => {
  try {
    const response = await fetch(`${apiBaseUrl}/favourites/file/${fileId}`)
    if (response.ok) {
      return await response.json()
    }
    return []
  } catch (error) {
    throw error
  }
}

const addFavourite = async (fileId) => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken')
    const response = await fetch(`${apiBaseUrl}/favourites`, {
      method: 'POST',
      headers: {
        'x-access-token': userToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file_id: fileId }),
    })
    return response.ok
  } catch (error) {
    throw error
  }
}

const deleteFavourite = async (fileId) => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken')
    const response = await fetch(`${apiBaseUrl}/favourites/file/${fileId}`, {
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

const useLoadFavourites = (refresh) => {
  const [favourites, setFavourites] = useState([])

  useEffect(() => {
    const loadFavourites = async () => {
      try {
        const userToken = await SecureStore.getItemAsync('userToken')
        const favouriteResponse = await fetch(`${apiBaseUrl}/favourites`, {
          headers: {
            'x-access-token': userToken,
          },
        })
        if (favouriteResponse.ok) {
          const favouriteFiles = await favouriteResponse.json()

          const tagResponse = await fetch(`${apiBaseUrl}/tags/${tags.recipes}`)
          let tagIds = []
          if (tagResponse.ok) {
            tagIds = (await tagResponse.json()).map((item) => item.file_id)
          }

          const favIds = favouriteFiles.map((item) => item.file_id)

          const fileIds = favIds.filter((item) => tagIds.includes(item))

          const files = await Promise.all(
            fileIds.map(async (fileId) => {
              const fileResponse = await fetch(`${apiBaseUrl}/media/${fileId}`)
              return await fileResponse.json()
            })
          )

          setFavourites(files.sort((a, b) => b.file_id - a.file_id))
        }
      } catch (error) {
        throw error
      }
    }
    if (refresh) {
      setTimeout(() => {
        loadFavourites()
      }, 500)
    }
  }, [refresh])
  return favourites
}
const getFavouritesByUser = async () => {
  try {
    const userToken = await SecureStore.getItemAsync('userToken')
    const response = await fetch(`${apiBaseUrl}/favourites`, {
      headers: {
        'x-access-token': userToken,
      },
    })
    if (response.ok) {
      return await response.json()
    }
    return []
  } catch (error) {
    throw error
  }
}

export {
  useLoadRecipes,
  apiLogin,
  getCurrentUser,
  getUserDetails,
  checkIfUsernameExists,
  createUser,
  getUserAvatar,
  updateUserDetails,
  uploadFileWithTag,
  uploadMultipleFiles,
  uploadFileWithDescriptionAndTag,
  deleteFile,
  deleteMultipleFiles,
  updateFileDescription,
  getMultipleFileDetails,
  getPublicationsByUserAndTag,
  getLikesByUser,
  addLike,
  deleteLike,
  getLikes,
  getFavourites,
  addFavourite,
  deleteFavourite,
  useLoadFavourites,
  getFavouritesByUser,
}
