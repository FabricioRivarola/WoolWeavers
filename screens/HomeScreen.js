import React from "react";
import {
  View,
  Text,
  StyleSheet,
  LayoutAnimation,
  FlatList,
  Image,
  StatusBar,
  Button,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import { categories } from "./PostScreen"; // Asegúrate de que la ruta sea correcta
import { getDocs, collection } from "firebase/firestore"; // Asegúrate de tener importadas estas funciones
import Fire from "../Fire"; // Asegúrate de que la ruta sea correcta
import { db } from "../Fire";

const staticPosts = [
  {
    id: "1",
    name: "Carlos",
    text: "Kit de tejido básico",
    description:
      "Este kit incluye todos los materiales necesarios para tejer tu primer proyecto.",
    timestamp: 156919273726,
    avatar: require("../assets/fotos/logo.png"),
    image: require("../assets/fotos/5.jpg"),
    category: "conjuntos",
    userEmail: "carlos@example.com",
  },
  {
    id: "2",
    name: "Juana",
    text: "Proceso de mi sweater :)",
    description:
      "Comparte el proceso de creación de mi sweater de lana, paso a paso.",
    timestamp: 156919273726,
    avatar: require("../assets/fotos/logo.png"),
    image: require("../assets/fotos/7.jpg"),
    category: "patrones",
    userEmail: "juana@example.com",
  },
  {
    id: "3",
    name: "Marta",
    text: "Funda de almohada tejida a crochet",
    description:
      "Una hermosa funda de almohada tejida a mano, perfecta para decorar tu hogar.",
    timestamp: 156919273726,
    avatar: require("../assets/fotos/logo.png"),
    image: require("../assets/fotos/8.jpg"),
    category: "decoraciones",
    userEmail: "marta@example.com",
  },
  {
    id: "4",
    name: "Carmen",
    text: "Apoya vasos de tortuga",
    description:
      "Divertidos apoyavasos en forma de tortuga, ideales para cualquier ocasión.",
    timestamp: 156919273726,
    avatar: require("../assets/fotos/logo.png"),
    image: require("../assets/fotos/3.jpg"),
    category: "decoraciones",
    userEmail: "carmen@example.com",
  },
];

const defaultAvatar = require("../assets/fotos/logo.png");

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  state = {
    posts: [],
    selectedCategory: categories[0].value,
  };

  getLatestItemList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "post"));
      const firestorePosts = [];
      querySnapshot.forEach((doc) => {
        const post = {
          id: doc.id,
          ...doc.data(),
        };
        console.log("Post desde Firestore: ", post); // Verifica que el post tenga todas las propiedades necesarias
        firestorePosts.push(post);
      });

      // Combina las publicaciones de Firestore y las estáticas
      const allPosts = [...firestorePosts, ...staticPosts];

      // Ordena las publicaciones por timestamp en orden descendente
      const sortedPosts = allPosts.sort((a, b) => b.createdAt - a.createdAt);

      // Establece el estado con las publicaciones ordenadas
      this.setState({ posts: sortedPosts });
    } catch (error) {
      console.error("Error fetching posts: ", error);
    }
  };

  componentDidMount() {
    this.getLatestItemList();
  }

  filterPosts = () => {
    const { selectedCategory, posts } = this.state;
    return posts.filter((item) =>
      selectedCategory === "Todo" ? true : item.category === selectedCategory
    );
  };

  handleBuyPress = (post) => {
    const email = post.userEmail;
    const subject = `Interesado en ${post.name}`;
    const body = `Hola, estoy interesado en  el siguiente producto: \n \n ${post.name}\n \n Me gustaría recibir mas detalles sobre tu producto!`;

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    Linking.openURL(mailtoUrl).catch((err) =>
      console.error("Error al abrir el cliente de correo", err)
    );
  };

  renderPost = (post) => {
    return (
      <View style={styles.feedItem}>
        <Image
          source={post.userImage ? post.avatar : defaultAvatar}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <View style={styles.postHeader}>
            <View>
              <Text style={styles.name}>
                {post.userName || "Usuario Anónimo"}
              </Text>
              <Text style={styles.timestamp}>
                {moment(post.createdAt).fromNow()}
              </Text>
            </View>
          </View>
          <Text style={styles.post}>{post.name || "Texto no disponible"}</Text>

          <Image
            source={
              typeof post.image === "string" ? { uri: post.image } : post.image
            }
            style={styles.postImage}
            resizeMode="cover"
            onError={() =>
              console.error("Error cargando la imagen:", post.image)
            }
          />
          {/* <View style={styles.caja}> */}
          <Text style={styles.description}>
            {post.desc || "Descripción no disponible"}
          </Text>
          <Text style={styles.descriptionn}>
            Precio: ${post.price || "Precio no disponible"}
          </Text>

          <Text style={styles.description}>
            Categoria: {post.category || "Categoría no disponible"}
          </Text>
          {/* </View> */}
          <View style={styles.postActions}>
            <Button
              title="Comprar"
              onPress={() => this.handleBuyPress(post)}
              color="#7164B4"
            />
          </View>
        </View>
      </View>
    );
  };

  render() {
    LayoutAnimation.easeInEaseOut();
    const filteredPosts = this.filterPosts();
    return (
      <View style={styles.container}>
        <StatusBar barStyle={"dark-content"} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Feed</Text>
        </View>

        <View style={styles.picker}>
          <Picker
            selectedValue={this.state.selectedCategory}
            onValueChange={(itemValue) =>
              this.setState({ selectedCategory: itemValue })
            }
          >
            {categories.map((category) => (
              <Picker.Item
                key={category.value}
                label={category.label}
                value={category.value}
              />
            ))}
          </Picker>
        </View>

        <FlatList
          style={styles.feed}
          data={filteredPosts}
          renderItem={({ item }) => this.renderPost(item)}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DEFFFB", // Estilo de fondo
  },
  header: {
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#EFE2FA", // Color de fondo del header
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#454D65",
    // color: "black",
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000", // Color del texto del header
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 16,
    backgroundColor: "#EFE2FA", // Color de fondo del picker
  },
  feed: {
    marginHorizontal: 16,
  },
  feedItem: {
    backgroundColor: "#EFE2FA", // Color de fondo de los ítems
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    marginVertical: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 16,
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    color: "#454D65",
  },
  timestamp: {
    fontSize: 12,
    color: "#333", // Cambiado a un gris oscuro para mayor contraste
    marginTop: 4,
  },
  post: {
    marginTop: 10,
    fontSize: 16,
    color: "#7164B4",
  },
  description: {
    fontSize: 14,
    color: "#000", // Color del texto de la descripción 7164B4
    marginTop: 4,
  },
  descriptionn: {
    fontSize: 14,
    color: "#7164B4", // Color del texto de la descripción 7164B4
    marginTop: 4,
  },
  postImage: {
    width: "100%",
    height: 150,
    borderRadius: 5,
    marginVertical: 16,
    marginTop: 10,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    margin: 10,
  },
  caja: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#8F9FE4", // Color de fondo de la caja
    borderRadius: 5,
    padding: 16,
    shadowColor: "#454D65",
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10,
  },
});
