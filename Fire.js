import * as ImagePicker from "expo-image-picker";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Asegúrate de importar Firestore
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

class Fire {
  constructor() {
    this.auth = getAuth(app);
    this.firestore = getFirestore(app); // Agrega Firestore al constructor
    this.storage = getStorage(app);
  }

  // Método para seleccionar imagen usando ImagePicker
  pickImage = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
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

// Usa la instancia de Fire para exportar la referencia de Firestore
Fire.shared = new Fire();
export { Fire }; // Exporta Fire para acceder a su instancia
export default Fire;
