import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebase from "firebase/compat/app";
import Fire from "../Fire";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCZ7ispJE7ZhekjLLslUR5YWrF7D6pePKI",
  authDomain: "woolweavers-abf68.firebaseapp.com",
  projectId: "woolweavers-abf68",
  storageBucket: "woolweavers-abf68.appspot.com",
  messagingSenderId: "181615938800",
  appId: "1:181615938800:web:f402ce81b78fe2cf390635"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default class LoadingScreen extends React.Component {
  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      this.props.navigation.navigate(user ? "App" : "Auth");
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E9446A" />
        <Text>Loading...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
