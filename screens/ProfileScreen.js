import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default class ProfileScreen extends React.Component{
    render (){
        return(
            <View style={StyleSheet.container}>
                <Text>Profile Screen</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#DEFFFB",
      justifyContent: "center",
      alignItems: "center"
    }
  });