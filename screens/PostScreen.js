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
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Formik } from "formik";
import { ActivityIndicator, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCZ7ispJE7ZhekjLLslUR5YWrF7D6pePKI",
  authDomain: "woolweavers-abf68.firebaseapp.com",
  projectId: "woolweavers-abf68",
  storageBucket: "woolweavers-abf68.appspot.com",
  messagingSenderId: "181615938800",
  appId: "1:181615938800:web:f402ce81b78fe2cf390635",
};

// Inicializar Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig); // Inicializa Firebase solo si no ha sido inicializado
} else {
  app = getApps()[0]; // Usa la instancia ya inicializada
}

// Inicializar Auth con persistencia en AsyncStorage
let auth;
if (!getAuth(app)) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  auth = getAuth(app); // Obtén la instancia si ya está inicializada
}

const authInstance = getAuth();
if (authInstance.currentUser) {
  console.log("Usuario autenticado:", authInstance.currentUser);
} else {
  console.log("No hay usuario autenticado.");
}

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
  const [categoryList, setCategoryList] = useState([]);
  const [text, setText] = useState("");
  const storage = getStorage();
  const [loading, setLoading] = useState(false);

  // Obtiene permisos para la galería
  useEffect(() => {
    getPhotoPermission();
    getCategoryList();
  }, []);

  // Obtener categorías desde Firestore
  const getCategoryList = async () => {
    try {
      const db = getFirestore(app); // Obtén la instancia de Firestore
      const querySnapshot = await getDocs(collection(db, "Descripcion"));

      let categories = [];
      querySnapshot.forEach((doc) => {
        categories.push(doc.data()); // Agrega los datos de cada categoría a la lista
      });

      setCategoryList(categories); // Actualiza el estado con las categorías obtenidas
    } catch (error) {
      console.error("Error al obtener la lista de categorías:", error);
    }
  };

  // Solicitar permiso para acceder a la galería de fotos
  const getPhotoPermission = async () => {
    if (Constants.platform.android) {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Se necesita acceso a tu galería.");
      }
    }
  };

  // Función para seleccionar imagen de la galería
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri; // Accede a la URI correctamente
        setImage(imageUri);
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
    }
  };

  // Función para manejar el posteo
  const handlePost = () => {
    console.log("Image URI:", image); // Verifica que la URI de la imagen esté definida

    if (image) {
      Fire.shared
        .addPost({ text: text.trim(), localUri: image })
        .then(() => {
          setText("");
          setImage(null);
          navigation.navigate("Home");
        })
        .catch((error) => {
          console.error("Error al postear:", error);
        });
    } else {
      alert("Selecciona una imagen antes de postear.");
    }
  };

  const onSubmitMethod = async (value) => {
    setLoading(true); // Set loading to true

    try {
      value.image = image; // Add image to the form data

      // Convert URI to blob for upload
      const resp = await fetch(image);
      const blob = await resp.blob();
      const storageRef = ref(storage, "fotos/" + Date.now() + ".jpg");

      // Upload the image
      await uploadBytes(storageRef, blob);
      console.log("Uploaded a blob file");

      const downloadURL = await getDownloadURL(storageRef);
      console.log(downloadURL); // Log the download URL

      // Continue with your post submission logic here
      // e.g., Fire.shared.addPost({...})
    } catch (error) {
      console.error("Error during image upload:", error);
    } finally {
      setLoading(false); // Reset loading state
      Alert.alert("Image Upload Success");
      navigation.navigate("Home");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={32} color={"#000"} />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Añadir Publicacion</Text>
      <Text style={styles.subt}>Publica y Comienza a Vender :)</Text>
      <Formik
        initialValues={{
          name: "",
          desc: "",
          category: "",
          address: "",
          price: "",
          image: "",
        }}
        onSubmit={(value) => onSubmitMethod(value)}
        //Validaciones para que no se publique nada vacio
        validate={(values) => {
          const error = {};
          if (!values.name) {
            console.log("No hay titulo");
            ToastAndroid.show("No hay titulo", ToastAndroid.SHORT);
            error.name = "Debe tener titulo";
          }
          if (!values.image) {
            console.log("No hay imagen");
            ToastAndroid.show("No hay imagen", ToastAndroid.SHORT);
            error.image = "Debe tener imagen";
          }
          if (!values.address) {
            console.log("No hay direccion");
            ToastAndroid.show("No hay direccion", ToastAndroid.SHORT);
            error.address = "Debe tener direccion";
          }
          if (!values.price) {
            console.log("No hay precio");
            ToastAndroid.show("No hay precio", ToastAndroid.SHORT);
            error.price = "Debe tener precio";
          }
          console.log(error);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <TextInput
              placeholder="Titulo"
              value={values?.name}
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
                ></Image>
              )}
            </TouchableOpacity>

            <TextInput
              placeholder="Descripcion"
              value={values?.desc}
              style={styles.input}
              numberOfLines={5}
              onChangeText={handleChange("desc")}
            />
            <TextInput
              placeholder="Precio"
              value={values?.price}
              style={styles.input}
              onChangeText={handleChange("price")}
              keyboardType="number-pad"
            />
            <View style={{ borderWidth: 1, borderRadius: 15 }}>
              <Picker
                selectedValue={values?.category}
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

            <TextInput
              placeholder="Direccion"
              value={values?.address}
              style={styles.input}
              onChangeText={handleChange("address")}
            />

            <TouchableOpacity
              onPress={handleSubmit}
              style={{
                backgroundColor: loading ? "#ccc" : "#007BFF",
                borderRadius: 20,
                padding: 12,
                backgroundColor: "#1877F2",
                marginTop: 20,
                marginBottom: 10,
                color: "#EEEEEE",
              }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Publicar</Text>
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
    backgroundColor: "#DEFFFB",
  },
  header: {
    // paddingTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9D8",
    color: "#000",
  },
  inputContainer: {
    margin: 32,
    flexDirection: "row",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
  },
  photo: {
    alignItems: "flex-end",
    marginHorizontal: 32,
  },
  input: {
    marginTop: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    paddingHorizontal: 17,
    fontSize: 17,
    textAlignVertical: "top",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
    color: "#000",
    // backgroundColor: "#DEFFE",
  },
  subt: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
    // marginTop: 10,
    color: "#999",
    // backgroundColor: "#DEFFFB",
  },
  btn: {
    borderRadius: 20,
    padding: 12,
    backgroundColor: "#1877F2",
    marginTop: 20,
    marginBottom: 10,
    color: "#EEEEEE",
  },
  btnText: {
    alignContent: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
});
