import React, { useContext } from 'react'
import { View } from 'react-native'
import { FlatList, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import ListItem from './ListItem'
import Tabs from './Tabs'
import { MainContext } from '../context/MainProvider'

const tabs = [
  {
    label: 'tabs.recipes.all',
    value: 'all',
  },
  {
    label: 'tabs.recipes.own',
    value: 'own',
  },
]

const List = ({
  navigation,
  onRefresh,
  recipes,
  refreshing,
  route,
  setActiveTab,
}) => {
  const { isLogged } = useContext(MainContext)

  return (
    <FlatList
      data={recipes}
      renderItem={(item) => (
        <ListItem dataItem={item} navigation={navigation} />
      )}
      ListHeaderComponent={
        <>
          {isLogged && route.name === 'Recipes' && (
            <View style={styles.tabContainer}>
              <Tabs
                defaultValue='all'
                onValueChange={(value) => setActiveTab(value)}
                tabs={tabs}
              />
            </View>
          )}
        </>
      }
      onRefresh={onRefresh}
      refreshing={refreshing}
      keyExtractor={(item) => item.file_id.toString()}
    />
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

List.propTypes = {
  navigation: PropTypes.object,
  onRefresh: PropTypes.func,
  recipes: PropTypes.arrayOf(PropTypes.object),
  refreshing: PropTypes.bool,
  route: PropTypes.object,
  setActiveTab: PropTypes.func,
}

export default List
