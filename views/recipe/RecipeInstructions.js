import React from 'react'
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { Text } from 'react-native-paper'
import PropTypes from 'prop-types'
import EditRecipeInstructions from '../../components/RecipeInstructions'

const RecipeInstructions = ({
  control,
  editMode,
  existingMedia,
  instructions,
}) => {
  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {editMode ? (
          <EditRecipeInstructions
            control={control}
            existingMedia={existingMedia}
            name='instructions'
          />
        ) : (
          <View style={styles.instructionsContainer}>
            {instructions.map((instruction, index) => (
              <Text key={index} style={styles.text}>
                {index + 1}. {instruction.text}
              </Text>
            ))}
          </View>
        )}
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  instructionsContainer: {
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

RecipeInstructions.propTypes = {
  control: PropTypes.any,
  editMode: PropTypes.bool,
  existingMedia: PropTypes.arrayOf(PropTypes.number),
  instructions: PropTypes.arrayOf(PropTypes.object),
}

export default RecipeInstructions
