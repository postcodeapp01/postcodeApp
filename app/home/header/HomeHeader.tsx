import React from "react";
import { View, TextInput, Text, Image, TouchableOpacity } from "react-native";
import homeStyles from "../../../sources/styles/HomeStyles";
import HeaderInputBox from "./HeaderInputBox";

export default function HomeHeader() {
    return (
        <View style={homeStyles.homeHeaderContainer}>
            <HeaderInputBox />
        </View>
    )
}