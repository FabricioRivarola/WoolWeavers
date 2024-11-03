import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebase from "firebase/compat/app";
import Fire from "../Fire";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDL3mxlu9Y5NJUUXcsIKde0Wp6Zm0lJYNc",
  authDomain: "woolweavers-7b93a.firebaseapp.com",
  projectId: "woolweavers-7b93a",
  storageBucket: "woolweavers-7b93a.appspot.com",
  messagingSenderId: "870014581991",
  appId: "1:870014581991:web:b5079a35c6ba049db4b642",
};

// Initialize Firebase
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
    alignItems: "center",
  },
});
