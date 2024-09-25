import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { initializeApp, getApps } from "firebase/app"; // Corrección aquí
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth"; // Corrección aquí
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Fire from "../Fire"; // Asegúrate de que este archivo esté correctamente configurado



const firebaseConfig = {
  apiKey: "AIzaSyCZ7ispJE7ZhekjLLslUR5YWrF7D6pePKI",
  authDomain: "woolweavers-abf68.firebaseapp.com",
  projectId: "woolweavers-abf68",
  storageBucket: "woolweavers-abf68.appspot.com",
  messagingSenderId: "181615938800",
  appId: "1:181615938800:web:f402ce81b78fe2cf390635"
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig); // Inicializa Firebase solo si no ha sido inicializado
} else {
  app = getApps()[0]; // Usa la instancia ya inicializada
}

// Inicializar Auth con persistencia en AsyncStorage solo si aún no está inicializado
let auth;
if (!getAuth(app)) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage) // Corrección aquí
  });
} else {
  auth = getAuth(app); // Obtén la instancia si ya está inicializada
}

export default class PostScreen extends React.Component {
  state = {
    text: "",
    image: null
  };

  componentDidMount() {
    this.getPhotoPermission();
  }

  getPhotoPermission = async () => {
    if (Constants.platform.android) {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Se necesita acceso a tu galería.");
      }
    }
  };

  pickImage = async () => {
    try {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        console.log(result);

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const imageUri = result.assets[0].uri; // Accede a la URI correctamente
            this.setState({ image: imageUri });
            console.log(imageUri); // Verifica que `imageUri` sea correcto
        }
    } catch (error) {
        console.error("Error al seleccionar imagen:", error);
    }
};



handlePost = () => {
  console.log("Image URI:", this.state.image);  // Verifica que la URI de la imagen esté definida

  if (this.state.image) {
      Fire.shared.addPost({ text: this.state.text.trim(), localUri: this.state.image })
      .then(() => {
          this.setState({ text: "", image: null });
          this.props.navigation.navigate('Home'); 
      })
      .catch(error => {
          console.error("Error al postear:", error);
      });
  } else {
      alert("Selecciona una imagen antes de postear.");
  }
  this.props.navigation.navigate('Home'); 
};


  

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={32} color={"#000"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handlePost}>
            <Text style={{ fontWeight: "800" }}>Post</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Image source={require("../assets/fotos/1.jpg")} style={styles.avatar} />
          <TextInput
            autoFocus={true}
            multiline={true}
            numberOfLines={5}
            style={{ flex: 1 }}
            placeholder="¿Algo para compartir?"
            value={this.state.text}
            onChangeText={text => this.setState({ text })}
          />
        </View>

        <TouchableOpacity style={styles.photo} onPress={this.pickImage}>
          <Ionicons name="camera-outline" size={32} color={"#000"} />
        </TouchableOpacity>

        {this.state.image && (
          <View style={{ marginHorizontal: 32, marginTop: 32, height: 150 }}>
            <Image source={{ uri: this.state.image }} style={{ width: "100%", height: "100%" }} />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DEFFFB"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9D8",
    color: "#000"
  },
  inputContainer: {
    margin: 32,
    flexDirection: "row"
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10
  },
  photo: {
    alignItems: "flex-end",
    marginHorizontal: 32
  }
});
