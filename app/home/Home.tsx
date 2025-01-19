import React from "react";
import { View, Text } from "react-native";
import homeStyles from "../../sources/styles/HomeStyles";


export default function Home() {
    return (
        <View style={homeStyles.homeContainer}>
            <Text> Hello Text</Text>
        </View>
    )
}