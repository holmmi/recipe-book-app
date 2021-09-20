import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { getCurrentUser } from '../hooks/ApiHooks'

const MainContext = React.createContext()

const MainProvider = (props) => {
  const [isLogged, setIsLogged] = useState(false)
  const [userDetails, setUserDetails] = useState(null)

  useEffect(() => {
    const getUserWithToken = async () => {
      const details = await getCurrentUser()
      if (details) {
        setUserDetails(details)
        setIsLogged(true)
      }
    }
    getUserWithToken()
  }, [])

  return (
    <MainContext.Provider
      value={{ isLogged, setIsLogged, userDetails, setUserDetails }}
    >
      {props.children}
    </MainContext.Provider>
  )
}

MainProvider.propTypes = {
  children: PropTypes.node,
}

export { MainContext, MainProvider }
