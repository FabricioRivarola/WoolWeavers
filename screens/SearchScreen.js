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
        firestorePosts.push(post);
      });

      const allPosts = [...firestorePosts];
      const sortedPosts = allPosts.sort((a, b) => b.createdAt - a.createdAt);
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
              color="#7164B4"
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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Buscar</Text>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar publicaciones..."
          onChangeText={(text) => this.setState({ searchQuery: text })}
          value={this.state.searchQuery}
        />
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
  feed: {
    marginHorizontal: 16,
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
  feedItem: {
    backgroundColor: "#EFE2FA",
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
    color: "#333",
    marginTop: 4,
  },
  post: {
    marginTop: 10,
    fontSize: 16,
    color: "#7164B4",
  },
  description: {
    fontSize: 14,
    color: "#000",
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
  searchInput: {
    height: 50,
    width: "100%",
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 16,
    backgroundColor: "#EFE2FA",
  },
});
