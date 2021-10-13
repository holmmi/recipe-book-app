import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Chip, TextInput } from 'react-native-paper'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const FreeTagInput = ({ label, name, setValue }) => {
  const [inputValue, setInputValue] = useState('')
  const [tags, setTags] = useState([])
  const { t } = useTranslation()

  useEffect(() => {
    setValue(name, tags)
  }, [tags])

  const addTag = () => {
    setTags([...tags, inputValue])
    setInputValue('')
  }

  const removeTag = (index) => {
    setTags([...tags.slice(0, index), ...tags.slice(index + 1)])
  }

  return (
    <View>
      <View style={styles.tagContainer}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            onClose={() => removeTag(index)}
            style={styles.chip}
          >
            {tag}
          </Chip>
        ))}
      </View>
      <TextInput
        mode='outlined'
        value={inputValue}
        onChangeText={(text) => setInputValue(text)}
        label={label}
        style={styles.textInput}
      />
      <View style={styles.buttonContainer}>
        <Button
          mode='contained'
          uppercase={false}
          color='#F6AE2D'
          style={styles.button}
          labelStyle={{ color: 'white' }}
          onPress={addTag}
          disabled={inputValue === ''}
        >
          {t('form.search.add')}
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 5,
    marginBottom: 5,
  },
  button: {
    width: '50%',
    borderRadius: 100,
  },
  chip: {
    margin: 5,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: 'white',
  },
})

FreeTagInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  setValue: PropTypes.func,
}

export default FreeTagInput
