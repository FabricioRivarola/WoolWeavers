import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

class Fire {
    constructor() {
        this.auth = getAuth(app);
        this.firestore = getFirestore(app);
        this.storage = getStorage(app);
    }

    addPost = async ({ text, localUri }) => {
        const remoteUri = await this.uploadPhotoAsync(localUri, `photos/${this.uid}/${Date.now()}`);

        return new Promise((res, rej) => {
            this.firestore
                .collection("posts")
                .add({
                    text,
                    uid: this.uid,
                    timestamp: this.timestamp,
                    image: remoteUri
                })
                .then(ref => {res(ref)})
                .catch(error => {rej(error)});
        });
    };
    
    uploadPhotoAsync = async (uri, filename) => {
        return new Promise(async(res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();

            const storageRef = ref(this.storage, filename);
            const uploadTask = uploadBytes(storageRef, file);

            uploadTask.then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    res(downloadURL);
                }).catch(err => rej(err));
            }).catch(err => rej(err));
        });
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

        if (!pickerResult.cancelled) {
            return pickerResult.uri;  // Devuelve el URI de la imagen seleccionada
        }
    }

    get uid() {
        return (this.auth.currentUser || {}).uid;
    }

    get timestamp() {
        return Date.now();
    }
}

Fire.shared = new Fire();
export default Fire;
