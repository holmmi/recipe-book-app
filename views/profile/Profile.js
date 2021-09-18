import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { Button } from 'react-native-paper'

const Profile = ({ navigation }) => {
  const { t } = useTranslation()

  const logout = () => {}

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.logoutButtonContainer}>
          <Button
            icon='logout'
            mode='text'
            uppercase={false}
            color='white'
            onPress={logout}
          >
            {t('account.logout')}
          </Button>
        </View>
      ),
      headerRightStyle: { ...styles.logoutButton },
    })
  }, [navigation])

  return <SafeAreaView style={styles.container}></SafeAreaView>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  logoutButtonContainer: {
    marginRight: 10,
  },
})

export default Profile
