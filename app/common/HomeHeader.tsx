import React from "react";
import { View, TextInput, Text, Image, TouchableOpacity } from "react-native";
import homeStyles from "../../sources/styles/HomeStyles";

export default function HomeHeader() {
    return (
        <View style={homeStyles.homeHeaderContainer}>
            <TouchableOpacity style={homeStyles.homeHeaderSearchInputContainer}>
                <Image source={require('../../sources/images/small_logo.png')} style={homeStyles.homeSearchIcon}resizeMode="center" />
                <Text>Search for a product</Text>
            </TouchableOpacity>    
        </View>
    )
}