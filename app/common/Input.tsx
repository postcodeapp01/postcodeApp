import React from "react";
import { View, Text, TextInput } from "react-native";
import { LoginStyles } from "../../sources/styles/loginStyles";

export default function Input({ label, onChangeInput  }: { label: string, onChangeInput: (param: string) => void}) {
    return (
        <View>
            <Text>{label}</Text>
            <TextInput onChangeText={(text) => onChangeInput(text)} style={LoginStyles.inputBorderContainer} />
        </View>
    )
}