import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import RecipeCard from '../../components/RecipeCard'
import PropTypes from 'prop-types'
import { getRecipeFiles } from '../../hooks/ApiHooks'

const RecipeBasicDetails = ({ dataItem }) => {
  return (
    <View style={styles.container}>
      <RecipeCard dataItem={dataItem}></RecipeCard>
    </View>
  )
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
