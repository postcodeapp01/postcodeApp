import React from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import Icon from '@react-native-vector-icons/evil-icons';
import CartIcon from '@react-native-vector-icons/common';
import homeStyles from "../../../sources/styles/HomeStyles";
import { CommonStyles } from "../../../sources/styles/common";

export default function HeaderInputBox() {
    return (
        <View style={[CommonStyles.flexRow, CommonStyles.marginVerticalMd, CommonStyles.spaceBetween]}>
            <TouchableOpacity style={homeStyles.homeHeaderSearchInputContainer}>
                <Text>Global Search</Text>
            </TouchableOpacity> 
            <Icon name="bell" size={30} />
            <Icon name="heart" size={30} />
            <Icon name="cart" size={30} />
        </View>
    )
}