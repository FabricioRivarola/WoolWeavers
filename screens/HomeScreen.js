import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, FlatList, Image, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";


post = [
  {
    id: "1",
    name: "Carlos",
    text: "Kit de tejido basico",
    timestamp: 156919273726,
    avatar: require("../assets/fotos/logo.png"),
    image: require("../assets/fotos/5.jpg")
  },
  {
    id: "2",
    name: "Juana",
    text: "Proceso de mi sweater :)",
    timestamp: 156919273726,
    avatar: require("../assets/fotos/logo.png"),
    image: require("../assets/fotos/7.jpg")
  },
  {
    id: "3",
    name: "Marta",
    text: "Funda de almohada tejida a crochet",
    timestamp: 156919273726,
    avatar: require("../assets/fotos/logo.png"),
    image: require("../assets/fotos/8.jpg")
  },
  {
    id: "4",
    name: "Carmen",
    text: "Apoya vasos de tortuga",
    timestamp: 156919273726,
    avatar: require("../assets/fotos/logo.png"),
    image: require("../assets/fotos/3.jpg")
  },
]


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    headerShown: false
  };  
  
  renderPost = post => {
    return (
      <View style={styles.feedItem}>
        <Image source={post.avatar} style={styles.avatar}/>
        <View style={{flex:1}}>
          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <View>
              <Text style={styles.name}>{post.name}</Text>
              <Text style={styles.timestamp}>{moment(post.timestamp).fromNow()}</Text>
            </View>
          
            <Ionicons name="ellipsis-horizontal" size={24} color="#73788B"></Ionicons>
          </View>

          <Text style={styles.post}>{post.text}</Text>

          <Image source={post.image} style={styles.postImage} resizeMode="cover"/>

          <View style={{flexDirection: "row", marginTop: 10}}>
            <Ionicons name="heart-outline" size={24} color="73788B" style={{marginRight: 16}}></Ionicons>
            <Ionicons name="chatbox-ellipses-outline" size={24} color="73788B" style={{marginRight: 16}}></Ionicons>
          </View>

        </View>
      </View>
    );  
  };

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <View style={styles.container}>
        <StatusBar barStyle={"dark-content"}></StatusBar>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Feed</Text>
        </View>

        <FlatList 
          style={styles.feed} 
          data={post} 
          renderItem={({item}) => this.renderPost(item)}
          keyExtractor={item => this.id}
          showsVerticalScrollIndicator={false}
        ></FlatList>
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
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EBECF4",
    shadowColor: "#454D65",
    shadowOffset: {height: 5},
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10
  },
  headerTitle:{
    fontSize: 20,
    fontWeight: "700"
  },
  feed:{
    marginHorizontal: 16
  },
  feedItem:{
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    marginVertical: 8
  },
  avatar: {
    width: 36,
    height: 36, 
    borderRadius: 18,
    marginRight: 16
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    color: "#454D65"
  },
  timestamp: {
    fontSize: 11,
    color: "#C4C6CE",
    marginTop: 4
  },
  post: {
    marginTop: 10,
    fontSize: 14,
    color: "#838899"
  },
  postImage: {
    width: undefined,
    height: 150,
    borderRadius: 5,
    MarginVertical: 16,
    marginTop: 10
  }
});
