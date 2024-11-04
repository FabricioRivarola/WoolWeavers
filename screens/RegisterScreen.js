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
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Importa Firebase Storage
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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app); // Inicializa Firebase Storage

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

    console.log("Resultado de la selección de imagen:", result); // Log para verificar la selección de la imagen

    // Asegúrate de que se esté accediendo a la propiedad correcta
    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri; // URI de la imagen seleccionada
      this.setState({ user: { ...this.state.user, avatar: uri } });

      // Obtener una referencia al almacenamiento
      const storage = getStorage(app);
      const storageRef = ref(storage, `avatars/${user.uid}.jpg`); // Cambia `user.uid` a tu identificador de usuario

      // Cargar la imagen
      const response = await fetch(uri);
      const blob = await response.blob();
      uploadBytes(storageRef, blob)
        .then((snapshot) => {
          console.log("Imagen subida:", snapshot);
        })
        .catch((error) => {
          console.log("Error durante la carga:", error);
        });
    }
  };

  handleSignUp = async () => {
    const { name, email, password, avatar } = this.state.user; // Desestructura el usuario
    console.log("Datos del usuario:", this.state.user); // Log para verificar los datos del usuario

    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;

      console.log("Usuario creado:", user); // Log para verificar el usuario creado

      // Si hay un avatar, súbelo a Firebase Storage
      if (avatar) {
        const response = await fetch(avatar);
        const blob = await response.blob();
        const avatarRef = ref(storage, `avatars/${user.uid}`); // Crea una referencia única en Storage

        console.log("Referencia del avatar:", avatarRef); // Log para verificar la referencia

        // Sube el archivo
        await uploadBytes(avatarRef, blob);
        console.log("Imagen subida con éxito."); // Log para verificar que la imagen se subió

        // Obtiene la URL de descarga
        const avatarURL = await getDownloadURL(avatarRef);
        console.log("URL del avatar:", avatarURL); // Log para verificar la URL

        // Actualiza el perfil del usuario con la URL del avatar
        await updateProfile(user, {
          displayName: name,
          photoURL: avatarURL, // Guarda la URL del avatar
        });
        console.log("Perfil del usuario actualizado."); // Log para verificar que el perfil se actualizó
      } else {
        await updateProfile(user, {
          displayName: name,
        });
        console.log("Perfil del usuario actualizado sin avatar."); // Log para verificar que se actualizó sin avatar
      }

      // Aquí puedes agregar el código para guardar la información del usuario en Firestore si es necesario
    } catch (error) {
      console.log("Error durante el registro:", error.message); // Log para verificar el error
      this.setState({ errorMessage: error.message });
    }
  };

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <ScrollView style={styles.container}>
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
      </ScrollView>
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
    marginTop: 50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#009381",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
