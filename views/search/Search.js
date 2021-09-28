import React from 'react'
import { SafeAreaView, StyleSheet, View, ScrollView } from 'react-native'
import SearchForm from '../../components/SearchForm'

const Search = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchForm />
      </View>
    </ScrollView>
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
