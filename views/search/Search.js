import React from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import SearchForm from '../../components/SearchForm'

const Search = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchForm />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  searchContainer: {
    flex: 1,
    padding: 10,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'flex-start',
  },
})

export default Search
