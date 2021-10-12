import React, { useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import DropDown from 'react-native-paper-dropdown'
import diets from '../constants/diets'

const DietDropdown = ({ handleInputChange }) => {
  const { t } = useTranslation()
  const [showMultiSelectDropDown, setShowMultiSelectDropDown] = useState(false)
  const [dietsValue, setDietsValue] = useState('')

  //this is needed because value needs to be a string in the dropdown menu...
  const dietList = diets.map((item) => ({
    value: item.value.toString(),
    label: t(item.label),
  }))

  return (
    <View styles={styles.inputBox}>
      <DropDown
        label={t('form.search.diet')}
        mode={'outlined'}
        visible={showMultiSelectDropDown}
        dropDownItemStyle={styles.input}
        showDropDown={() => setShowMultiSelectDropDown(true)}
        onDismiss={() => setShowMultiSelectDropDown(false)}
        value={dietsValue}
        setValue={(newDiets) => {
          setDietsValue(newDiets)
          handleInputChange('diets', newDiets)
        }}
        list={dietList}
        multiSelect
      />
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
  },
  inputBox: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
})

DietDropdown.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
}

export default DietDropdown
