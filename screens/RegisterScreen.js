import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  LayoutAnimation,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import * as ImagePicker from "expo-image-picker";

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

export default class RegisterScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  state = {
    user: {
      name: "",
      email: "",
      password: "",
      avatar: null,
    },
    errorMessage: null,
  };

  handlePickAvatar = async () => {
    // Solicita permisos para acceder a la galería
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

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

    if (!result.canceled) {
      this.setState({ user: { ...this.state.user, avatar: result.uri } });
    }
  };

  handleSignUp = () => {
    const { name, email, password } = this.state.user; // Desestructura el usuario
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        return updateProfile(user, {
          displayName: name,
        });
      })
      .catch((error) => this.setState({ errorMessage: error.message }));
  };

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.avatarPlaceholder}
          onPress={this.handlePickAvatar}
        >
          {this.state.user.avatar ? (
            <Image
              source={{ uri: this.state.user.avatar }}
              style={styles.avatar}
            />
          ) : (
            <Ionicons
              name="add"
              size={40}
              color={"#FFF"}
              style={{ marginTop: 6, marginLeft: 2 }}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.back}
          onPress={() => this.props.navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={32} color={"#000"} />
        </TouchableOpacity>

        <Text
          style={styles.greeting}
        >{`Hola.\nBienvenido a nuestra comunidad.`}</Text>

        <View style={styles.errorMessage}>
          <Text style={styles.error}>{this.state.errorMessage}</Text>
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.inputTitle}>Nombre Completo</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={(name) =>
                this.setState((prevState) => ({
                  user: { ...prevState.user, name },
                }))
              }
              value={this.state.user.name}
            />
          </View>
          <View style={{ marginTop: 32 }}>
            <Text style={styles.inputTitle}>Email Address</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={(email) =>
                this.setState((prevState) => ({
                  user: { ...prevState.user, email },
                }))
              }
              value={this.state.user.email}
            />
          </View>

          <View style={{ marginTop: 32 }}>
            <Text style={styles.inputTitle}>Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
              onChangeText={(password) =>
                this.setState((prevState) => ({
                  user: { ...prevState.user, password },
                }))
              }
              value={this.state.user.password}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
          <Text style={{ color: "#000", fontWeight: "500" }}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ alignSelf: "center", marginTop: 32 }}
          onPress={() => this.props.navigation.navigate("Login")}
        >
          <Text style={{ color: "#414959", fontSize: 13 }}>
            ¿Tienes cuenta?{" "}
            <Text style={{ fontWeight: "500", color: "#009381" }}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DEFFFB",
  },
  greeting: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
  },
  error: {
    color: "#E9446A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 30,
  },
  inputTitle: {
    color: "#8A8F9E",
    fontSize: 10,
    textTransform: "uppercase",
  },
  input: {
    borderBottomColor: "#8A8F9E",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: "#161F3D",
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: "#56FFEB",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
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
    justifyContent: "center",
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#56FFEB",
    marginTop: 48,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 150,
  },
  avatar: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
