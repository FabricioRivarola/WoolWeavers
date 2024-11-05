import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { categories } from "./PostScreen"; // Importamos categorías
import Icon from "react-native-vector-icons/Ionicons"; // Importa los íconos

const db = getFirestore();

export default function EditPostScreen({ route, navigation }) {
  const { postId } = route.params;

  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [postCategory, setPostCategory] = useState("");
  const [postAddress, setPostAddress] = useState("");
  const [postPrice, setPostPrice] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const docRef = doc(db, "post", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const postData = docSnap.data();
          setPostTitle(postData.name || "");
          setPostDescription(postData.desc || "");
          setPostCategory(postData.category || "");
          setPostAddress(postData.address || "");
          setPostPrice(postData.price || "");
          setPostImage(postData.image || null);
        } else {
          Alert.alert("Error", "No se encontró la publicación.");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error al cargar la publicación:", error);
        Alert.alert("Error", "No se pudo cargar la publicación.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Se necesitan permisos para acceder a la galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPostImage(result.assets[0].uri);
    }
  };

  const handleUpdatePost = async () => {
    try {
      const postRef = doc(db, "post", postId);
      await updateDoc(postRef, {
        name: postTitle,
        desc: postDescription,
        category: postCategory,
        address: postAddress,
        price: postPrice,
        image: postImage,
      });

      Alert.alert("Éxito", "La publicación se ha actualizado correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al actualizar la publicación:", error);
      Alert.alert("Error", "No se pudo actualizar la publicación.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Contenedor para la flecha de retroceso y el texto */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.labell}>Editar Publicación</Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <Text style={styles.label}>Título de la Publicación</Text>
        <TextInput
          style={styles.input}
          value={postTitle}
          onChangeText={setPostTitle}
        />

        <Text style={styles.label}>Descripción de la Publicación</Text>
        <TextInput
          style={styles.input}
          value={postDescription}
          onChangeText={setPostDescription}
          multiline
        />

        <Text style={styles.label}>Precio</Text>
        <TextInput
          style={styles.input}
          value={postPrice}
          onChangeText={setPostPrice}
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          value={postAddress}
          onChangeText={setPostAddress}
        />

        <Text style={styles.label}>Categoría</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={postCategory}
            onValueChange={(itemValue) => setPostCategory(itemValue)}
          >
            {categories.map((item, index) => (
              <Picker.Item key={index} label={item.label} value={item.value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Imagen</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {postImage ? (
            <Image source={{ uri: postImage }} style={styles.postImage} />
          ) : (
            <Text style={styles.imagePickerText}>Seleccionar Imagen</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.btn} onPress={handleUpdatePost}>
        <Text style={styles.btnText}>Actualizar Publicación</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#EFE2FA",
  },
  header: {
    flexDirection: "row", // Alinea horizontalmente
    alignItems: "center", // Centra verticalmente
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10, // Espacio entre la flecha y el texto
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  labell: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
    marginLeft: 85,
  },
  input: {
    height: 40,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#DEFFFB",
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "#CCC",
    backgroundColor: "#DEFFFB",
    margin: 10,
  },
  imagePicker: {
    alignItems: "center",
    backgroundColor: "#DEFFFB",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: 150,
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center", // Centrar horizontalmente
  },
  postImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
    margin: 10,
  },
  imagePickerText: {
    color: "#888",
    margin: 10,
  },
  btn: {
    backgroundColor: "#7164B4",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "100%",
  },
  btnText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
