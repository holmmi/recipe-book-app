import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { getCurrentUser } from '../hooks/ApiHooks'
import { Keyboard } from 'react-native'

const MainContext = React.createContext()

const MainProvider = (props) => {
  const [isLogged, setIsLogged] = useState(false)
  const [userDetails, setUserDetails] = useState({})
  const [updateUserDetails, setUpdateUserDetails] = useState(true)
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const [addRecipe, setAddRecipe] = useState(false)

  useEffect(() => {
    const getUserWithToken = async () => {
      const details = await getCurrentUser()
      if (details) {
        setUserDetails(details)
        setIsLogged(true)
      }
    }
    if (updateUserDetails) {
      getUserWithToken()
      setUpdateUserDetails(false)
    }
  }, [updateUserDetails])

  //from https://stackoverflow.com/a/57502759
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true)
      }
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false)
      }
    )

    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [])

  return (
    <MainContext.Provider
      value={{
        isLogged,
        setIsLogged,
        userDetails,
        setUserDetails,
        setUpdateUserDetails,
        isKeyboardVisible,
        addRecipe,
        setAddRecipe,
      }}
    >
      {props.children}
    </MainContext.Provider>
  )
}

MainProvider.propTypes = {
  children: PropTypes.node,
}

export { MainContext, MainProvider }
