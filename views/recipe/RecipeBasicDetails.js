import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'

const RecipeBasicDetails = ({ dataItem }) => {
  return <View style={styles.container}></View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

RecipeBasicDetails.propTypes = {
  dataItem: PropTypes.object,
}

export default RecipeBasicDetails
