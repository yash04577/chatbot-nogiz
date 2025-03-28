import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import Toast from "react-native-toast-message";

export default function UserInfoScreen() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigation = useNavigation<any>();

  //validating email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
  
    if (email && phone) {

      if (!validateEmail(email)) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Email',
          text2: 'Please enter a valid email address',
        });
        return;
      }
    
      if (phone.length !== 10 || !/^\d+$/.test(phone)) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Phone Number',
          text2: 'Phone number must be exactly 10 digits',
        });
        return;
      }

      //saving details no local storage
      await AsyncStorage.setItem("userEmail", email);
      await AsyncStorage.setItem("userPhone", phone);
      Toast.show({
        type: 'success',
        text1: 'Logged In Succesfull',
      });
  
      //moving to chat screen
      navigation.navigate("(tabs)")
    }
    else{
      Toast.show({
        type: 'error',
        text1: 'Fill All Fields',
        text2: 'Please enter email and phone number',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.formContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.form}>
        <Text style={styles.label}>Enter Your Info</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
  },
  subtext: {
    marginTop: 8,
    fontSize: 14,
    color: "gray",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    padding: 20,
  },
  form: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
