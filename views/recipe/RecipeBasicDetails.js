import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import RecipeCard from '../../components/RecipeCard'
import PropTypes from 'prop-types'
import { getRecipeFiles } from '../../hooks/ApiHooks'

const RecipeBasicDetails = ({ dataItem }) => {
  const [recipe, setRecipe] = useState({})
  const [files, setFiles] = useState([])

  const getMedia = async (media) => {
    return await getRecipeFiles(media)
  }

  useEffect(() => {
    const newRecipe = JSON.parse(dataItem.description)
    setRecipe(newRecipe)
    const newFiles = getMedia(newRecipe.media)
    console.log(newFiles)
    setFiles(newFiles)
  }, [dataItem, setRecipe, setFiles])

  return (
    <View style={styles.container}>
      <RecipeCard recipe={recipe} files={files}></RecipeCard>
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
