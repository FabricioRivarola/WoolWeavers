import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ToastAndroid,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Formik } from "formik";
import { ActivityIndicator } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
  addDoc,
} from "firebase/firestore";

import { useUser } from "@clerk/clerk-react";

// Configuración de Firebase
// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDL3mxlu9Y5NJUUXcsIKde0Wp6Zm0lJYNc",
  authDomain: "woolweavers-7b93a.firebaseapp.com",
  projectId: "woolweavers-7b93a",
  storageBucket: "woolweavers-7b93a.appspot.com",
  messagingSenderId: "870014581991",
  appId: "1:870014581991:web:b5079a35c6ba049db4b642",
};

// Inicializar Firebase y Firestore correctamente
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
const db = getFirestore(app); // Usar getFirestore para obtener la instancia de Firestore

// Inicializar Auth
let auth;
if (!getAuth(app)) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  auth = getAuth(app);
}
const storage = getStorage(app);

export const categories = [
  { label: "Categoria", value: "Categoria" },
  { label: "Lanas", value: "lanas" },
  { label: "Conjuntos", value: "conjuntos" },
  { label: "Prendas", value: "prendas" },
  { label: "Decoraciones", value: "decoraciones" },
  { label: "Patrones", value: "patrones" },
];

export default function PostScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPhotoPermission();
  }, []);

  const getPhotoPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Se necesita acceso a tu galería.");
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setImage(imageUri);
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
    }
  };

  const onSubmitMethod = async (values) => {
    setLoading(true);
    // Validar información antes de continuar
    if (
      !image ||
      !values.name ||
      !values.price ||
      !values.category ||
      !values.desc
    ) {
      ToastAndroid.show("Falta Información", ToastAndroid.SHORT);
      setLoading(false);
      return; // Salir de la función si falta información
    }

    try {
      const resp = await fetch(image);
      const blob = await resp.blob();
      const imageName = Date.now() + ".jpg";
      const storageRef = ref(storage, `fotos/${imageName}`);

      // Intenta subir la imagen y obtener la URL
      const snapshot = await uploadBytes(storageRef, blob);
      console.log("Imagen subida exitosamente:", snapshot);

      const downloadURL = await getDownloadURL(storageRef);
      console.log("URL de descarga:", downloadURL);

      const user = auth.currentUser; // Asegúrate de que `auth` esté definido

      if (user) {
        values.image = downloadURL;
        values.userName = user.displayName; // Cambia según tu estructura de usuario
        values.userEmail = user.email; // Cambia según tu estructura de usuario
        values.userImage = user.photoURL; // Cambia según tu estructura de usuario
      } else {
        throw new Error("No se encontró información del usuario.");
      }
      // Ahora intenta guardar el post en Firestore
      const postRef = await addDoc(collection(db, "post"), values);
      if (postRef.id) {
        console.log("Documento añadido con ID:", postRef.id);
      }
      // const postData = {
      //   id: postRef.id,
      //   name: values.name,
      //   desc: values.desc,
      //   category: values.category,
      //   address: values.address,
      //   price: values.price,
      //   image: downloadURL,
      //   createdAt: new Date(),
      //   userId: auth.currentUser.uid,
      // };
      // await setDoc(postRef, postData);
      // console.log("Post creado correctamente");

      // Aquí puedes continuar con la lógica de envío de publicaciones
      // Por ejemplo: Fire.shared.addPost({...})

      Alert.alert("Imagen subida con éxito");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error durante la subida de imagen:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={32} color={"#000"} />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Añadir Publicación</Text>
      <Text style={styles.subt}>Publica y Comienza a Vender :)</Text>
      <Formik
        initialValues={{
          name: "",
          desc: "",
          category: "",
          address: "",
          price: "",
          image: "",
          userName: "",
          userEmail: "",
          userImage: "",
        }}
        onSubmit={(values) => onSubmitMethod(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <TextInput
              placeholder="Título"
              value={values.name}
              style={styles.input}
              onChangeText={handleChange("name")}
            />
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={pickImage}
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: 100, height: 100, borderRadius: 15 }}
                />
              ) : (
                <Image
                  source={require("../assets/fotos/logo.png")}
                  style={{ width: 100, height: 100, borderRadius: 15 }}
                />
              )}
            </TouchableOpacity>

            <TextInput
              placeholder="Descripción"
              value={values.desc}
              style={styles.input}
              numberOfLines={5}
              onChangeText={handleChange("desc")}
            />
            <TextInput
              placeholder="Precio"
              value={values.price}
              style={styles.input}
              onChangeText={handleChange("price")}
              keyboardType="number-pad"
            />
            <TextInput
              placeholder="Direccion"
              value={values.address}
              style={styles.input}
              onChangeText={handleChange("address")}
            />
            <View style={{ borderWidth: 1, borderRadius: 15 }}>
              <Picker
                selectedValue={values.category}
                onValueChange={handleChange("category")}
              >
                {categories.map((item, index) => (
                  <Picker.Item
                    key={index}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Publicar</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    marginTop: Constants.statusBarHeight,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subt: {
    fontSize: 18,
    marginBottom: 20,
    color: "grey",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#3b5998",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

//minuto 1:38:30
