import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Divider, IconButton, Subheading } from 'react-native-paper'
import { useFieldArray } from 'react-hook-form'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import DataInput from './DataInput'
import Multimedia from './Multimedia'

const rules = {
  instruction: {
    required: {
      value: true,
      message: 'form.newRecipe.instructionRequired',
    },
  },
}

const RecipeInstructions = ({ control, existingMedia, name }) => {
  const { append, fields, remove, swap } = useFieldArray({ control, name })
  const { t } = useTranslation()

  const addRow = () => {
    append({ text: '' })
  }

  const deleteRow = (index) => {
    remove(index)
  }

  const swapRowDown = (index) => {
    swap(index, index + 1)
  }

  const swapRowUp = (index) => {
    swap(index, index - 1)
  }

  return (
    <View style={styles.container}>
      <Subheading>{t('form.newRecipe.instruction')}</Subheading>
      <Divider />
      {fields.map((field, index) => {
        return (
          <View key={field.id} style={styles.inputContainer}>
            <View style={{ width: '70%', padding: 5 }}>
              <DataInput
                control={control}
                multiline={true}
                name={`${name}.${index}.text`}
                rules={rules.instruction}
              />
            </View>
            {index === 0 && index === fields.length - 1 && (
              <View style={styles.iconContainer}>
                <IconButton
                  icon='delete'
                  color='#8B0000'
                  onPress={() => deleteRow(index)}
                  style={styles.iconButton}
                />
              </View>
            )}
            {index === 0 && fields.length > 0 && (
              <View style={styles.iconContainer}>
                <IconButton
                  icon='arrow-down'
                  color='#00008B'
                  onPress={() => swapRowDown(index)}
                  style={styles.iconButton}
                />
                <IconButton
                  icon='delete'
                  color='#8B0000'
                  onPress={() => deleteRow(index)}
                  style={styles.iconButton}
                />
              </View>
            )}
            {index > 0 && index < fields.length - 1 && (
              <View style={styles.iconContainer}>
                <IconButton
                  icon='arrow-down'
                  color='#00008B'
                  onPress={() => swapRowDown(index)}
                  style={styles.iconButton}
                />
                <IconButton
                  icon='arrow-up'
                  color='#00008B'
                  onPress={() => swapRowUp(index)}
                  style={styles.iconButton}
                />
                <IconButton
                  icon='delete'
                  color='#8B0000'
                  onPress={() => deleteRow(index)}
                  style={styles.iconButton}
                />
              </View>
            )}
            {index > 0 && index === fields.length - 1 && (
              <View style={styles.iconContainer}>
                <IconButton
                  icon='arrow-up'
                  color='#00008B'
                  onPress={() => swapRowUp(index)}
                  style={styles.iconButton}
                />
                <IconButton
                  icon='delete'
                  color='#8B0000'
                  onPress={() => deleteRow(index)}
                  style={styles.iconButton}
                />
              </View>
            )}
          </View>
        )
      })}
      <View style={styles.buttonContainer}>
        <Button
          uppercase={false}
          compact={true}
          icon='plus'
          mode='contained'
          color='#F6AE2D'
          labelStyle={{ color: 'white' }}
          style={styles.button}
          onPress={addRow}
        >
          {t('form.newRecipe.addRow')}
        </Button>
      </View>
      <View style={styles.mediaSection}>
        <Subheading>{t('form.newRecipe.addMedia')}</Subheading>
        <Multimedia
          control={control}
          defaultValues={existingMedia}
          name='media'
        />
      </View>
    </View>
  )
}

RecipeInstructions.propTypes = {
  control: PropTypes.any,
  existingMedia: PropTypes.arrayOf(PropTypes.number),
  name: PropTypes.string,
}

const styles = StyleSheet.create({
  button: {
    width: '40%',
    borderRadius: 100,
  },
  buttonContainer: {
    flexDirection: 'row-reverse',
    marginTop: 10,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  iconButton: {
    margin: 0,
  },
  iconContainer: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaSection: {
    marginTop: 10,
    marginBottom: 10,
  },
})

export default RecipeInstructions
