import React, { useState } from 'react'

const MainContext = React.createContext()

const MainProvider = (props) => {
  const [isLogged, setIsLogged] = useState(false)
  const [userDetails, setUserDetails] = useState(null)

  return (
    <MainContext.Provider
      value={(isLogged, setIsLogged, userDetails, setUserDetails)}
    >
      {props.children}
    </MainContext.Provider>
  )
}

export { MainContext, MainProvider }
