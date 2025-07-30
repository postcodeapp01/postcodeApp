import React from "react";
import { ActivityIndicator, Modal, View } from "react-native";
import { CommonStyles } from "../../../sources/styles/common";

const Loader = () => {
    return (
       <Modal visible style={{ flex: 1, backgroundColor: "rgba(255, 255, 255, 0.5)"}} transparent>
        <ActivityIndicator size="large" />
       </Modal>
    )
}

export default Loader;