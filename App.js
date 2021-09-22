import React from 'react'
import { MainProvider } from './context/MainProvider'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import Navigation from './navigation/Navigation'
import { StatusBar } from 'expo-status-bar'
import './services/i18n/i18n'

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF6347',
    accent: '#F6AE2D',
  },
}

const App = () => {
  return (
    <MainProvider>
      <PaperProvider theme={theme}>
        <StatusBar style='light' />
        <Navigation />
      </PaperProvider>
    </MainProvider>
  )
}

export default App
