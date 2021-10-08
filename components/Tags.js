import React, { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { Chip } from 'react-native-paper'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const Tags = ({ dataSource, tags }) => {
  const { t } = useTranslation()

  const filteredTags = useCallback(() => {
    const mapTags = dataSource.filter(
      (data) => tags.includes(data.value) === true
    )
    return mapTags
  }, [tags])

  return (
    <View style={styles.container}>
      {filteredTags().map((tag) => (
        <Chip key={tag.value} style={styles.chip}>
          {t(tag.label)}
        </Chip>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 5,
  },
})

Tags.propTypes = {
  dataSource: PropTypes.arrayOf(PropTypes.object),
  tags: PropTypes.arrayOf(PropTypes.number),
}

export default Tags
