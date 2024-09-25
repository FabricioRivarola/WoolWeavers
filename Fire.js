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
        const remoteUri = await this.uploadPhotoAsync(localUri);    
        try {
            const postsRef = collection(this.firestore, "posts");
            const docRef = await addDoc(postsRef, {
                text,
                uid: this.uid,
                timestamp: this.timestamp,
                image: remoteUri
            });
    
            return docRef;
        } catch (error) {
            throw error;
        }
    };
    
    

    uploadPhotoAsync = async uri => {
        try {
            const path = `photos/${this.uid}/${Date.now()}.jpg`;
            const response = await fetch(uri);
            const file = await response.blob();
            const storageRef = ref(this.storage, path);

            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            return url;
        } catch (error) {
            console.error("Error al subir la foto:", error);
            throw error;
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
