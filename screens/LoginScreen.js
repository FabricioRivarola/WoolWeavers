import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, StatusBar, LayoutAnimation } from "react-native";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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

export default class LoginScreen extends React.Component {
    static navigationOptions =  {
        headerShown: false
    };
    state = {
        email: "",
        password: "",
        errorMessage: null
    };

    handleLogin = () => {
        const { email, password } = this.state; 
        signInWithEmailAndPassword(auth, email, password)
        .catch(error => this.setState({ errorMessage: error.message }));
    };

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <View style={styles.container}>
        
        <StatusBar barStyle="light-content" ></StatusBar>

        <Image
          source={require('../assets/fotos/logo.png')} 
          style={styles.image}
        />

        <Text style={styles.greeting}>{`\n Bienvenido \n`}</Text>

        <View style={styles.errorMessage}>
          {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
        </View>

        <View style={styles.form}>
          <View>
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

        <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
          <Text style={{ color: "#000", fontWeight: "500" }}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ alignSelf: "center", marginTop: 32 }}
          onPress={() => this.props.navigation.navigate("Register")}
        >
          <Text style={{ color: "#414959", fontSize: 13 }}>
            ¿Usuario Nuevo? <Text style={{ fontWeight: "500", color: "#009381" }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#DEFFFB",
    flex: 1
  },
  greeting: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center" 
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginTop: 50 
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30
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
  }
});
