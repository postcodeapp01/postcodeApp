import React from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import homeStyles from "../../../sources/styles/HomeStyles";
import Icon from '@react-native-vector-icons/fontawesome6';

export default function HeaderInputBox() {
    return (
        <View>
            <TouchableOpacity style={homeStyles.homeHeaderSearchInputContainer}>
                <Image source={require('../../../sources/images/small_logo.png')} style={homeStyles.homeSearchIcon}resizeMode="center" />
                <Text>Search for a product</Text>
            </TouchableOpacity> 
            <Icon name="comments" size={30} />
        </View>
    )
}