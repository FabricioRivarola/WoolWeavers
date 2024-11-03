import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Fire from "../Fire";
import { doc, onSnapshot } from "firebase/firestore";
import { Button } from "react-native-paper";
import { getAuth } from "firebase/auth";

export default class ProfileScreen extends React.Component {
  state = {
    user: {},
    postCount: 0,
  };

  unsubscribe = null;

  componentDidMount() {
    const auth = getAuth();

    // Escuchar el estado de autenticación
    this.unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const userDoc = doc(Fire.shared.firestore, "users", user.uid);

        this.unsubscribe = onSnapshot(userDoc, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            this.setState({
              user: userData,
              postCount: userData.posts ? userData.posts.length : 0,
            });
          } else {
            console.error("No user data found for user ID:", user.uid);
          }
        });
      } else {
        console.error("User is not logged in!");
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
    }
  }

  render() {
    const { user, postCount } = this.state;

    return (
      <View style={styles.container}>
        <View style={{ marginTop: 64, alignItems: "center" }}>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={
                user.avatar
                  ? { uri: user.avatar }
                  : require("../assets/fotos/logo.png")
              }
            />
          </View>
          <Text style={styles.name}>{user.name || "No Name"}</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statAmount}>{postCount}</Text>
            <Text style={styles.statTitle}>Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statAmount}>{user.followers || 0}</Text>
            <Text style={styles.statTitle}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statAmount}>{user.following || 0}</Text>
            <Text style={styles.statTitle}>Following</Text>
          </View>
        </View>
        <Button
          onPress={() => {
            Fire.shared
              .logout()
              .then(() => {
                this.props.navigation.navigate("Login");
              })
              .catch((error) => {
                console.error("Logout failed: ", error);
              });
          }}
        >
          <Text>Logout</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DEFFFB",
  },
  avatarContainer: {
    shadowColor: "#151734",
    shadowRadius: 15,
    shadowOpacity: 0.4,
  },
  avatar: {
    width: 136,
    height: 136,
    borderRadius: 68,
  },
  name: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 32,
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  statAmount: {
    color: "#4f566d",
    fontSize: 18,
    fontWeight: "300",
  },
  statTitle: {
    color: "#c3c5cd",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
});
