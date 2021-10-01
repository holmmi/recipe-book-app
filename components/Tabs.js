import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { ToggleButton, Text } from 'react-native-paper'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const Tabs = ({ defaultValue, onValueChange, tabs }) => {
  const [toggledButton, setToggledButton] = useState(defaultValue)
  const { t } = useTranslation()

  useEffect(() => {
    onValueChange(toggledButton)
  }, [toggledButton])

  const onToggleButtonValueChange = (value) => {
    if (value) {
      setToggledButton(value)
    }
  }

  return (
    <ToggleButton.Row
      onValueChange={onToggleButtonValueChange}
      value={toggledButton}
    >
      {tabs.map((tab, index) => (
        <ToggleButton
          key={index}
          icon={() => (
            <Text
              style={{
                color: toggledButton === tab.value ? 'white' : 'tomato',
                fontWeight: 'bold',
              }}
            >
              {t(tab.label)}
            </Text>
          )}
          value={tab.value}
          style={{
            ...styles.toggleButton,
            backgroundColor: toggledButton === tab.value ? 'tomato' : 'white',
          }}
          status={toggledButton === tab.value ? 'checked' : 'unchecked'}
        />
      ))}
    </ToggleButton.Row>
  )
}

const styles = StyleSheet.create({
  toggleButton: {
    width: 100,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'tomato',
    backgroundColor: 'white',
  },
})

Tabs.defaultProps = {
  defaultValue: '',
}

Tabs.propTypes = {
  defaultValue: PropTypes.string,
  onValueChange: PropTypes.func,
  tabs: PropTypes.arrayOf(PropTypes.object),
}

export default Tabs
