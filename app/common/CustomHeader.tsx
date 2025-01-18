import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import { LoginStyles } from "../../sources/styles/loginStyles";
import { useNavigation } from "@react-navigation/native";

export default function CustomHeader({ title }: { title: string}) {
    const navigation = useNavigation()
    return (
        <View style={LoginStyles.MainHeaderContainer}> 
        <TouchableOpacity onPress={() => navigation.goBack()}>
           <Image source={require('../../sources/images/Left.png')}  />
        </TouchableOpacity>
            <Text style={{ marginLeft: 15 }}>{title}</Text>
        </View>
    )
}