import React, { useEffect } from "react";
import { View,Text, Image } from "react-native";
import { LoginStyles } from "../../sources/styles/loginStyles";

export default function FlashScreen() {

    useEffect(() => {

    }, []);

    return (
        <View style={LoginStyles.flashscreenContainer}>
            <Image source={require('../../sources/images/flashscreen_logo.png')} />
        </View>
    )
}