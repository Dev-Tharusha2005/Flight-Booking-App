import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    const userStr = await AsyncStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user || user.email !== email) {
      Alert.alert("Error", "Invalid details !");
      return;
    }
    navigation.replace('Home');
  };

  const { container, logo, title, subtitle, input, button, buttonText, linkText } = styles;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#001B4B' }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={container}>
        <Image source={require('./assets/logo.png')} style={logo} />

        <Text style={title}>Sign In</Text>
        <Text style={subtitle}>Welcome back! Please login to your account.</Text>

        <TextInput style={input} placeholder="Email" placeholderTextColor="#BAD0E3" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={input} placeholder="Password" placeholderTextColor="#BAD0E3" value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={button} onPress={handleSignIn}>
          <Text style={buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  logo: { width: 200, height: 200, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 16, color: "#BAD0E3", marginBottom: 30, textAlign: "center" },
  input: { width: "100%", height: 55, borderColor: "#BAD0E3", borderWidth: 1, borderRadius: 30, paddingHorizontal: 20, marginBottom: 20, color: "#fff" },
  button: { width: "100%", height: 55, backgroundColor: "#BAD0E3", borderRadius: 30, justifyContent: "center", alignItems: "center", marginVertical: 10 },
  buttonText: { color: "#001B4B", fontSize: 20, fontWeight: "bold" },
  linkText: { color: "#BAD0E3", marginTop: 15, fontSize: 16 },
});
