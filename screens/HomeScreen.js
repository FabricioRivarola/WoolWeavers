import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";

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

export default class HomeScreen extends React.Component {
  state = {
    email: "",
    displayName: ""
  };

  componentDidMount() {
    const user = auth.currentUser;
    if (user) {
      this.setState({
        email: user.email,
        displayName: user.displayName
      });
    }
  }

  signOutUser = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out!");
        this.props.navigation.navigate("Auth");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <View style={styles.container}>
        <Text>Hola, {this.state.displayName || this.state.email}</Text>

        <TouchableOpacity style={{ marginTop: 32 }} onPress={this.signOutUser}>
          <Text>Log Out</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DEFFFB",
    justifyContent: "center",
    alignItems: "center"
  }
});
