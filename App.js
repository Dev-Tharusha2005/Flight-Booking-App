import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

import SignIn from './SignIn';
import SignUp from './SignUp';
import Home from './Home';
import SearchResults from './SearchResults';

const Stack = createStackNavigator();

function WelcomeScreen({ navigation }) {
  const { container, coverImg, button, btnText } = styles;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          navigation.replace('Home');
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  if (loading) {
    return (
      <View style={container}>
        <ActivityIndicator size="large" color="#BAD0E3" />
      </View>
    );
  }

  return (
    <View style={container}>
      <Image source={require("./assets/cover.png")} style={coverImg} />

      <TouchableOpacity style={button} onPress={() => navigation.navigate("SignIn")}>
        <Text style={btnText}>Get Started</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='WelcomeScreen' component={WelcomeScreen} />
        <Stack.Screen name='SignIn' component={SignIn} />
        <Stack.Screen name='SignUp' component={SignUp} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='SearchResults' component={SearchResults} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001B4B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverImg: {
    width: "90%",
    height: 310,
    position: 'absolute'
  },
  button: {
    width: "60%",
    height: 65,
    backgroundColor: "#BAD0E3",
    marginTop: 600,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  btnText: {
    fontSize: 26,
    color: "#001B4B"
  }
});
