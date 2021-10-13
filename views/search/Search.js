import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, ScrollView } from 'react-native'
import SearchForm from '../../components/SearchForm'

const Search = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchForm navigation={navigation} />
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

Search.propTypes = {
  navigation: PropTypes.object,
}

export default Search
