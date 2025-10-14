import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUp({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Invalid email address");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    const userData = { firstName, lastName, email };
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    navigation.replace('SignIn');
  };

  const { container, logo, title, subtitle, input, button, buttonText, linkText } = styles;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#001B4B' }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={container}>
        <Image source={require('./assets/logo.png')} style={logo} />

        <Text style={title}>Sign Up</Text>
        <Text style={subtitle}>Create your account and get started!</Text>

        <TextInput style={input} placeholder="First Name" placeholderTextColor="#BAD0E3" value={firstName} onChangeText={setFirstName} />
        <TextInput style={input} placeholder="Last Name" placeholderTextColor="#BAD0E3" value={lastName} onChangeText={setLastName} />
        <TextInput style={input} placeholder="Email" placeholderTextColor="#BAD0E3" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={input} placeholder="Password" placeholderTextColor="#BAD0E3" value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={button} onPress={handleSignUp}>
          <Text style={buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text style={linkText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  logo: { width: 150, height: 150, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 16, color: "#BAD0E3", marginBottom: 30, textAlign: "center" },
  input: { width: "100%", height: 55, borderColor: "#BAD0E3", borderWidth: 1, borderRadius: 30, paddingHorizontal: 20, marginBottom: 20, color: "#fff" },
  button: { width: "100%", height: 55, backgroundColor: "#BAD0E3", borderRadius: 30, justifyContent: "center", alignItems: "center", marginVertical: 10 },
  buttonText: { color: "#001B4B", fontSize: 20, fontWeight: "bold" },
  linkText: { color: "#BAD0E3", marginTop: 15, fontSize: 16 },
});
