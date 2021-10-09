import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { getCurrentUser } from '../hooks/ApiHooks'

const MainContext = React.createContext()

const MainProvider = (props) => {
  const [isLogged, setIsLogged] = useState(false)
  const [search, setSearch] = useState(false)
  const [userDetails, setUserDetails] = useState({})
  const [updateUserDetails, setUpdateUserDetails] = useState(true)

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

  return (
    <MainContext.Provider
      value={{
        isLogged,
        setIsLogged,
        search,
        setSearch,
        userDetails,
        setUserDetails,
        setUpdateUserDetails,
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
