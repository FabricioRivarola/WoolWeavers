import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, StatusBar, LayoutAnimation } from "react-native";
import {Ionicons} from "@expo/vector-icons"
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import UserPermissions from "../utilities/UserPermissions";
import * as ImagePicker from "expo-image-picker"
import Fire from "../Fire"

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

export default class RegisterScreen extends React.Component {
    static navigationOptions = {
        headerShown: false
    };
  
  state = {
    user: {
      name: "",
      email: "",
      password: "",
      avatar: null,
    },
    
    errorMessage: null
  };

  handlePickAvatar = async () => {
    // Solicita permisos para acceder a la galería
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
        alert("Se requieren permisos para acceder a la galería.");
        return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.cancelled) {
        this.setState({ user: { ...this.state.user, avatar: result.uri } });
    }
};


  handleSignUp = () => {
    createUserWithEmailAndPassword(auth, this.state.email, this.state.password)
      .then(userCredentials => {
        const user = userCredentials.user;
        return updateProfile(user, {
          displayName: this.state.name
        });
      })
      .catch(error => this.setState({ errorMessage: error.message }));
  };

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.avatarPlaceholder} onPress={this.handlePickAvatar}>
          <Image source={{uri: this.state.user.avatar}} style={styles.avatar}/>
          <Ionicons name="add" size={40} color={"#FFF"} style={{marginTop: 6, marginLeft: 2}}></Ionicons>
        </TouchableOpacity>

      
        <TouchableOpacity style={styles.back} onPress={() => this.props.navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={32} color={"#000"}></Ionicons>
        </TouchableOpacity>

        <Text style={styles.greeting}>{`Hola.\nBienvenido a nuestra comunidad.`}</Text>

        

        <View style={styles.errorMessage}>
          <Text style={styles.error}>{this.state.errorMessage}</Text>
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.inputTitle}>Nombre Completo</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={name => this.setState({ name })}
              value={this.state.name}
            />
          </View>
          <View style={{ marginTop: 32 }}>
            <Text style={styles.inputTitle}>Email Address</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
            />
          </View>

          <View style={{ marginTop: 32 }}>
            <Text style={styles.inputTitle}>Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
          <Text style={{ color: "#000", fontWeight: "500" }}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ alignSelf: "center", marginTop: 32 }} onPress={() => this.props.navigation.navigate("Login")}>
          <Text style={{ color: "#414959", fontSize: 13 }}>
            ¿Tienes cuenta? <Text style={{ fontWeight: "500", color: "#009381" }}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DEFFFB"
  },
  greeting: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center"
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginTop: 50 
  },
  error: {
    color: "#E9446A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center"
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 30
  },
  inputTitle: {
    color: "#8A8F9E",
    fontSize: 10,
    textTransform: "uppercase"
  },
  input: {
    borderBottomColor: "#8A8F9E",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: "#161F3D"
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: "#56FFEB",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center"
  },
  back: {
    position: "absolute", 
    top: 15,
    left: 15,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(21, 22, 48, 0.1)",
    alignItems: "center",
    justifyContent: "center"
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#56FFEB",
    marginTop: 48, 
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 150
  },
  avatar: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
  },  
});
