// App.js
import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { AppRegistry } from "react-native";
import { WoolWeavers as appName } from "./app.json";

// Pantallas
import LoadingScreen from "./screens/LoadingScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import RegisterScreen from "./screens/RegisterScreen";
// import MessageScreen from "./screens/MessageScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PostScreen from "./screens/PostScreen";
import SearchScreen from "./screens/SearchScreen";

// Firebase
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuración de Firebase

// Inicializar Auth con persistencia en AsyncStorage
const auth = getAuth();
if (!auth) {
  initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false, // Asegúrate de que esta opción está aquí
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#B8BBC4",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="home-outline"
              size={focused ? 24 : 20}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="glasses-outline"
              size={focused ? 28 : 24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={PostScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="camera-outline"
              size={24}
              color={color}
              // style={{
              //   shadowColor: "#E9446A",
              //   shadowOffset: { width: 0, height: 0 },
              //   shadowRadius: 10,
              //   shadowOpacity: 0.3,
              // }}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("PostModal");
          },
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="accessibility-outline"
              size={focused ? 24 : 20}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="Auth"
          component={AuthStackScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="App"
          component={TabNavigator}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="PostModal"
          component={PostScreen}
          options={{ presentation: "modal", headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const AuthStack = createNativeStackNavigator();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

AppRegistry.registerComponent(appName, () => App);

export default App;
