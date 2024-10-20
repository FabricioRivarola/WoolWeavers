import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Fire from "../Fire";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { Button } from "react-native-paper";

export default class ProfileScreen extends React.Component {
  state = {
    user: {}, // Asegurarse de que el estado 'user' sea siempre un objeto
  };

  unsubscribe = null;

  componentDidMount() {
    const user = this.props.uid || Fire.shared.uid;

    if (user) {
      const userDoc = doc(Fire.shared.firestore, "users", user);

      this.unsubscribe = onSnapshot(userDoc, (docSnapshot) => {
        if (docSnapshot.exists()) {
          // Verifica si el documento existe antes de acceder a sus datos
          this.setState({ user: docSnapshot.data() });
        } else {
          console.error("No user data found!");
        }
      });
    } else {
      console.error("User ID is undefined!");
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const { user } = this.state;

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
            <Text style={styles.statAmount}>21</Text>
            <Text style={styles.statTitle}>Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statAmount}>21</Text>
            <Text style={styles.statTitle}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statAmount}>210</Text>
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
          Logout
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
