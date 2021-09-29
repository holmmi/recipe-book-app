import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { TextInput, List, Chip } from 'react-native-paper'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const TagInput = ({
  name,
  defaultValue,
  label,
  dataSource,
  register,
  setValue,
  minSearchTermLength,
}) => {
  const [inputValue, setInputValue] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [tags, setTags] = useState([])
  const { t } = useTranslation()

  useEffect(() => {
    register(name)
    setTags(defaultValue)
  }, [])

  useEffect(() => {
    setValue(name, tags)
  }, [tags])

  const onChangeText = (text) => {
    setInputValue(text)
    if (text.length >= minSearchTermLength) {
      const results = dataSource.filter((data) =>
        t(data.label)
          .toLowerCase()
          .startsWith(text.toLowerCase() && !tags.includes(data.value))
      )
      setSearchResults(results)
    }
  }

  const onFocus = () => {
    if (minSearchTermLength === 0 && inputValue.length === 0) {
      const results = dataSource.filter((data) => !tags.includes(data.value))
      setSearchResults(results)
    } else {
      if (inputValue.length >= minSearchTermLength) {
        const results = dataSource.filter((data) =>
          t(data.label)
            .toLowerCase()
            .startsWith(inputValue.toLowerCase() && !tags.includes(data.value))
        )
        setSearchResults(results)
      }
    }
  }

  const addTag = (value) => {
    setTags([...tags, value])
    setSearchResults([])
  }

  const removeTag = (index) => {
    setTags([...tags.slice(0, index), ...tags.slice(index + 1)])
  }

  return (
    <View style={styles.container}>
      <View style={styles.tags}>
        {tags.map((tag, index) => {
          const { value, label } = dataSource.filter(
            (data) => data.value === tag
          )[0]
          return (
            <Chip
              key={value}
              onClose={() => removeTag(index)}
              style={styles.chip}
            >
              {t(label)}
            </Chip>
          )
        })}
      </View>
      <TextInput
        mode='outlined'
        value={inputValue}
        onChangeText={onChangeText}
        onFocus={onFocus}
        label={label}
        style={styles.textInput}
      />
      {searchResults.length > 0 && (
        <ScrollView style={styles.searchResults}>
          {searchResults
            .filter((searchResult) => !tags.includes(searchResult.value))
            .map((searchResult) => {
              return (
                <List.Item
                  key={searchResult.value}
                  title={t(searchResult.label)}
                  onPress={() => addTag(searchResult.value)}
                />
              )
            })}
        </ScrollView>
      )}
    </View>
  )
}

TagInput.defaultProps = {
  defaultValue: [],
  minSearchTermLength: 0,
}

TagInput.propTypes = {
  name: PropTypes.string,
  defaultValue: PropTypes.array,
  label: PropTypes.string,
  dataSource: PropTypes.arrayOf(PropTypes.object),
  register: PropTypes.func,
  setValue: PropTypes.func,
  minSearchTermLength: PropTypes.number,
}

const styles = StyleSheet.create({
  chip: {
    margin: 5,
  },
  container: {
    position: 'relative',
    marginTop: 10,
    marginBottom: 10,
  },
  searchResults: {
    maxHeight: 100,
    width: '100%',
    borderColor: '#ccc',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: 'white',
  },
})

export default TagInput
