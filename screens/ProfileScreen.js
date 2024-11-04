import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Importa Firebase Storage
import * as ImagePicker from "expo-image-picker";

// Inicializar Firebase y Firestore
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

export default function ProfileScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAvatar, setUserAvatar] = useState(null);
  const user = auth.currentUser; // Obtiene el usuario actual

  useEffect(() => {
    if (user) {
      const userPostsRef = collection(db, "post");
      const q = query(userPostsRef, where("userEmail", "==", user.email)); // Filtrar por email
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const postsData = [];
        querySnapshot.forEach((doc) => {
          postsData.push({ ...doc.data(), id: doc.id });
        });
        setPosts(postsData);
        setLoading(false);
      });

      // Cargar el avatar inicial
      setUserAvatar(user.photoURL);

      return () => unsubscribe(); // Cleanup subscription on unmount
    }
  }, [user]);

  const handlePickAvatar = async () => {
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

    // Asegúrate de que se esté accediendo a la propiedad correcta
    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri; // URI de la imagen seleccionada
      setUserAvatar(uri); // Actualiza el estado con la nueva imagen

      // Obtener una referencia al almacenamiento
      const avatarRef = ref(storage, `avatars/${user.uid}`); // Crea una referencia única en Storage

      // Cargar la imagen
      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(avatarRef, blob);
      console.log("Imagen subida con éxito."); // Log para verificar que la imagen se subió

      // Obtiene la URL de descarga
      const avatarURL = await getDownloadURL(avatarRef);
      console.log("URL del avatar:", avatarURL); // Log para verificar la URL

      // Actualiza el perfil del usuario con la URL del avatar
      await updateProfile(user, {
        photoURL: avatarURL, // Guarda la URL del avatar
      });
      console.log("Perfil del usuario actualizado con nueva imagen.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Cierra sesión
      navigation.navigate("Login"); // Redirige a la pantalla de login (ajusta según tu navegación)
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3b5998" />
      ) : (
        <ScrollView>
          {user && (
            <View style={styles.userInfoContainer}>
              <TouchableOpacity onPress={handlePickAvatar}>
                {userAvatar ? (
                  <Image
                    source={{ uri: userAvatar }}
                    style={styles.userImage}
                  />
                ) : (
                  <View style={styles.defaultImage} />
                )}
              </TouchableOpacity>
              <Text style={styles.userName}>
                {user.displayName || "Nombre no disponible"}
              </Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          )}

          {posts.length > 0 ? (
            posts.map((post) => (
              <View key={post.id} style={styles.postContainer}>
                <Text style={styles.postTitle}>{post.name}</Text>
                {post.image && (
                  <Image
                    source={{ uri: post.image }}
                    style={styles.postImage}
                  />
                )}
                <Text style={styles.postDescription}>{post.desc}</Text>
                <Text style={styles.postPrice}>Precio: {post.price}</Text>
                <Text style={styles.postCategory}>
                  Categoría: {post.category}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noPostsText}>No tienes publicaciones aún.</Text>
          )}
        </ScrollView>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#DEFFFB",
  },
  header: {
    marginTop: Constants.statusBarHeight,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#FFE",
    borderBottomWidth: 1,
    borderBottomColor: "#EBECF4",
    shadowColor: "#454D65",
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  userInfoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  defaultImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#CCC",
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 16,
    color: "#888",
  },
  postContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    marginVertical: 10,
  },
  postDescription: {
    fontSize: 14,
    color: "#333",
  },
  postPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007BFF",
  },
  postCategory: {
    fontSize: 12,
    color: "#555",
  },
  noPostsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#FF4C4C",
    borderRadius: 5,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
