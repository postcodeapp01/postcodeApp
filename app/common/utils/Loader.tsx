import React from "react";
import { ActivityIndicator, View } from "react-native";
import { CommonStyles } from "../../../sources/styles/common";

const Loader = () => {
    return (
        <View style={[CommonStyles.popupContainer, CommonStyles.center, { backgroundColor: "rgba(255, 255, 255, 0.5)"}]}>
            <ActivityIndicator size="large" />
        </View>
    )
}

export default Loader;