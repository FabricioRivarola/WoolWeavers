import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  StatusBar,
  Button,
  Linking,
  TextInput,
} from "react-native";
import moment from "moment";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../Fire";
import { Ionicons } from "@expo/vector-icons";

const defaultAvatar = require("../assets/fotos/logo.png");

export default class SearchScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  state = {
    posts: [],
    searchQuery: "",
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
      const allPosts = [...firestorePosts];

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

  filterPostsByName = () => {
    const { searchQuery, posts } = this.state;
    return posts.filter((post) =>
      post.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  handleBuyPress = (post) => {
    const email = post.userEmail;
    const subject = `Interesado en ${post.name}`;
    const body = `Hola, estoy interesado en el siguiente producto: \n\n${post.name}\n\n¡Me gustaría recibir más detalles!`;

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
          source={post.avatar ? { uri: post.avatar } : defaultAvatar}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{post.name || "Usuario Anónimo"}</Text>
          <Text style={styles.timestamp}>
            {moment(post.createdAt).fromNow()}
          </Text>
          <Text style={styles.post}>{post.name}</Text>

          <Image
            source={
              typeof post.image === "string" ? { uri: post.image } : post.image
            }
            style={styles.postImage}
            resizeMode="cover"
          />
          <Text style={styles.description}>
            {post.desc || "Descripción no disponible"}
          </Text>
          <View style={styles.postActions}>
            <Button
              title="Comprar"
              onPress={() => this.handleBuyPress(post)}
              color="#841584"
            />
          </View>
        </View>
      </View>
    );
  };

  render() {
    const filteredPosts = this.filterPostsByName();
    return (
      <View style={styles.container}>
        <StatusBar barStyle={"dark-content"} />
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={{ marginRight: 10 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            onChangeText={(text) => this.setState({ searchQuery: text })}
            value={this.state.searchQuery}
          />
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
    backgroundColor: "#DEFFFB",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFE",
    borderBottomWidth: 1,
    borderBottomColor: "#EBECF4",
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: "#333",
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
    fontSize: 12,
    color: "#C4C6CE",
    marginTop: 4,
  },
  post: {
    marginTop: 10,
    fontSize: 16,
    color: "#838899",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  postImage: {
    width: "100%",
    height: 150,
    borderRadius: 5,
    marginVertical: 16,
    marginTop: 10,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    margin: 10,
  },
});
