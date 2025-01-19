import React from "react";
import { View, TextInput, Text } from "react-native";
import homeStyles from "../../sources/styles/HomeStyles";

export default function HomeHeader() {
    return (
        <View style={homeStyles.homeHeaderContainer}>
            <TextInput />
            <Text>Hello Home Header</Text>
        </View>
    )
}