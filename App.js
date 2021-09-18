import React from 'react'
import { MainProvider } from './context/MainProvider'
import { Provider as PaperProvider } from 'react-native-paper'
import Navigation from './navigation/Navigation'
import './services/i18n/i18n'

const App = () => {
  return (
    <MainProvider>
      <PaperProvider>
        <Navigation />
      </PaperProvider>
    </MainProvider>
  )
}

export default App
