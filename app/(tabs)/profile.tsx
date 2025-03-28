import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';


const Profile = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);

  // getting user data to display on profile page
  useEffect(() => {
    const fetchUserData = async () => {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      const storedPhone = await AsyncStorage.getItem('userPhone');
      setEmail(storedEmail);
      setPhone(storedPhone);
    };

    fetchUserData();
  }, []);

  //handling logout and routing to login page
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userEmail');
    await AsyncStorage.removeItem('userPhone');
    setEmail(null);
    setPhone(null);
    Alert.alert("Logged Out", "User data has been cleared.");
    router.replace("/login")
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      {email && phone ? (
        <>
          <Text style={styles.label}>Email: <Text style={styles.value}>{email}</Text></Text>
          <Text style={styles.label}>Phone: <Text style={styles.value}>{phone}</Text></Text>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.infoText}>No user info available.</Text>
      )}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '500',
  },
  value: {
    fontWeight: '400',
    color: '#1f2937',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  infoText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
  },
});
