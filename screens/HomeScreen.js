import React from "react";
import {
  View,
  Text,
  StyleSheet,
  LayoutAnimation,
  FlatList,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import { categories } from "./PostScreen"; // Asegúrate de que la ruta sea correcta

// Cambia el arreglo de publicaciones para incluir una propiedad 'category'
const post = [
  {
    id: "1",
    name: "Carlos",
    text: "Kit de tejido basico",
    timestamp: 156919273726,
    avatar: require("../assets/fotos/logo.png"),
    image: require("../assets/fotos/5.jpg"),
    category: "conjuntos", // Añadir categoría
  },
  {
    id: "2",
    name: "Juana",
    text: "Proceso de mi sweater :)",
    timestamp: 156919273726,
    avatar: require("../assets/fotos/logo.png"),
    image: require("../assets/fotos/7.jpg"),
    category: "patrones", // Añadir categoría
  },
  {
    id: "3",
    name: "Marta",
    text: "Funda de almohada tejida a crochet",
    timestamp: 156919273726,
    avatar: require("../assets/fotos/logo.png"),
    image: require("../assets/fotos/8.jpg"),
    category: "decoraciones", // Añadir categoría
  },
  {
    id: "4",
    name: "Carmen",
    text: "Apoya vasos de tortuga",
    timestamp: 156919273726,
    avatar: require("../assets/fotos/logo.png"),
    image: require("../assets/fotos/3.jpg"),
    category: "decoraciones", // Añadir categoría
  },
];

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  state = {
    selectedCategory: categories[0].value, // Estado para la categoría seleccionada
  };

  // Método para filtrar las publicaciones según la categoría seleccionada
  filterPosts = () => {
    const { selectedCategory } = this.state;
    return post.filter((item) =>
      selectedCategory === "Categoria"
        ? true
        : item.category === selectedCategory
    );
  };

  renderPost = (post) => {
    return (
      <View style={styles.feedItem}>
        <Image source={post.avatar} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <View style={styles.postHeader}>
            <View>
              <Text style={styles.name}>{post.name}</Text>
              <Text style={styles.timestamp}>
                {moment(post.timestamp).fromNow()}
              </Text>
            </View>
            <Ionicons name="ellipsis-horizontal" size={24} color="#73788B" />
          </View>
          <Text style={styles.post}>{post.text}</Text>
          <Image
            source={post.image}
            style={styles.postImage}
            resizeMode="cover"
          />
          <View style={styles.postActions}>
            <Ionicons
              name="heart-outline"
              size={24}
              color="73788B"
              style={{ marginRight: 16 }}
            />
            <Ionicons
              name="chatbox-ellipses-outline"
              size={24}
              color="73788B"
              style={{ marginRight: 16 }}
            />
          </View>
        </View>
      </View>
    );
  };

  render() {
    LayoutAnimation.easeInEaseOut();
    const filteredPosts = this.filterPosts(); // Obtener publicaciones filtradas
    return (
      <View style={styles.container}>
        <StatusBar barStyle={"dark-content"} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Feed</Text>
        </View>

        <View style={styles.picker}>
          {/* Picker para seleccionar categoría */}
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
          data={filteredPosts} // Usar publicaciones filtradas
          renderItem={({ item }) => this.renderPost(item)}
          keyExtractor={(item) => item.id} // Asegúrate de usar item.id
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DEFFFB",
  },
  header: {
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#FFE",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EBECF4",
    shadowColor: "#454D65",
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 16,
    borderColor: "#EBECF4",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#FFE",
  },
  feed: {
    marginHorizontal: 16,
  },
  feedItem: {
    backgroundColor: "#FFF",
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
    fontSize: 11,
    color: "#C4C6CE",
    marginTop: 4,
  },
  post: {
    marginTop: 10,
    fontSize: 14,
    color: "#838899",
  },
  postImage: {
    width: undefined,
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
    marginTop: 10,
  },
});
