import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Divider, IconButton, Subheading } from 'react-native-paper'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useFieldArray } from 'react-hook-form'
import DataInput from './DataInput'

const rules = {
  amount: {
    required: {
      value: true,
      message: 'form.newRecipe.amountMissing',
    },
    pattern: {
      value: /^(\d+|\d+,\d+)$/,
      message: 'form.newRecipe.amountNumbersOnly',
    },
  },
  substance: {
    required: {
      value: true,
      message: 'form.newRecipe.substanceMissing',
    },
  },
}

const RecipeSubstances = ({ control, name }) => {
  const { t } = useTranslation()
  const { append, fields, remove } = useFieldArray({ control, name })

  const addRow = () => {
    append({ amount: '', unit: '', substance: '' })
  }

  const deleteRow = (index) => {
    remove(index)
  }

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Subheading style={{ width: '20%', padding: 5 }}>
          {t('form.newRecipe.substances.amount')}
        </Subheading>
        <Subheading style={{ width: '20%', padding: 5 }}>
          {t('form.newRecipe.substances.unit')}
        </Subheading>
        <Subheading style={{ width: '40%', padding: 5 }}>
          {t('form.newRecipe.substances.substance')}
        </Subheading>
      </View>
      <Divider />
      {fields.map((field, index) => {
        return (
          <React.Fragment key={field.id}>
            <View style={styles.inputContainer}>
              <View style={{ width: '20%', padding: 5 }}>
                <DataInput
                  control={control}
                  name={`${name}.${index}.amount`}
                  rules={rules.amount}
                />
              </View>
              <View style={{ width: '20%', padding: 5 }}>
                <DataInput control={control} name={`${name}.${index}.unit`} />
              </View>
              <View style={{ width: '40%', padding: 5 }}>
                <DataInput
                  control={control}
                  name={`${name}.${index}.substance`}
                  rules={rules.substance}
                />
              </View>
              <IconButton
                icon='delete'
                color='#8B0000'
                onPress={() => deleteRow(index)}
              />
            </View>
            <Divider />
          </React.Fragment>
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
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  button: {
    width: '33.3%',
    borderRadius: 100,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 10,
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
})

RecipeSubstances.propTypes = {
  control: PropTypes.any,
  name: PropTypes.string,
}

export default RecipeSubstances
