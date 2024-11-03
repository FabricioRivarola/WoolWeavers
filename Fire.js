import * as ImagePicker from "expo-image-picker";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Importa Firestore
import { getStorage } from "firebase/storage";

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

// Inicializar Firestore
const db = getFirestore(app);

class Fire {
  constructor() {
    this.auth = getAuth(app);
    this.firestore = db; // Usar la instancia de Firestore
    this.storage = getStorage(app);
  }

  // Método para seleccionar imagen usando ImagePicker
  pickImage = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!result.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      return pickerResult.assets[0].uri; // Devuelve el URI de la imagen seleccionada
    }
  };

  get uid() {
    return (this.auth.currentUser || {}).uid;
  }

  get timestamp() {
    return Date.now();
  }

  logout = () => {
    return this.auth.signOut();
  };
}

// Exportar la instancia de Fire y la base de datos
const FireInstance = new Fire();
export { FireInstance, db }; // Exportar FireInstance y db
export default FireInstance; // Exportar la instancia como default
