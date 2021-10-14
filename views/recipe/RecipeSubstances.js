import React from 'react'
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { Text } from 'react-native-paper'
import EditRecipeSubstances from '../../components/RecipeSubstances'
import PropTypes from 'prop-types'

const RecipeSubstances = ({ control, editMode, substances }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.container}>
        {editMode ? (
          <EditRecipeSubstances control={control} name='substances' />
        ) : (
          <View style={styles.substancesContainer}>
            {substances.map((substance, index) => (
              <Text key={index} style={styles.text}>
                {substance.amount} {substance.unit} {substance.substance}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  substancesContainer: {
    flex: 1,
    marginTop: 10,
  },
  text: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 26,
    color: 'black',
    textAlign: 'center',
  },
})

RecipeSubstances.propTypes = {
  control: PropTypes.any,
  editMode: PropTypes.bool,
  substances: PropTypes.arrayOf(PropTypes.object),
}

export default RecipeSubstances
