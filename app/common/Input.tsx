import React from "react";
import { View, Text, TextInput, StyleProp, TextStyle } from "react-native";
import { LoginStyles } from "../../sources/styles/loginStyles";

export default function Input({ label, onChangeInput, inputStyle, placeholder = "", value }: { label: string, onChangeInput: (param: string) => void, inputStyle?: StyleProp<TextStyle>, placeholder?: string, value: any }) {
    return (
        <View>
            <Text>{label}</Text>
            <TextInput
                onChangeText={onChangeInput}
                style={[LoginStyles.inputBorderContainer, inputStyle]}
                placeholder={placeholder}
                value={value}
            />
        </View>
    )
}