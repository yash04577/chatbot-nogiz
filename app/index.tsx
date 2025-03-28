import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'

const IndexScreen = () => {
  const navigation = useNavigation<any>()

  useEffect(() => {
    const checkUserData = async () => {
      try {
        // rerouting user based on local storage data
        const email = await AsyncStorage.getItem('userEmail')
        const phone = await AsyncStorage.getItem('userPhone')

        if (email && phone) {
          navigation.navigate("(tabs)") 
        } else {
          navigation.navigate("login") 
        }
      } catch (error) {
        console.error('Error reading AsyncStorage', error)
        navigation.navigate('LoginScreen')
      }
    }

    checkUserData()
  }, [])

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text>Checking user data...</Text>
    </View>
  )
}

export default IndexScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
