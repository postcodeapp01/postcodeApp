import React from "react";
import { View, Text } from "react-native";
import ImageCarousel from './components/ImageCarousels';
import homeStyles from "../../sources/styles/HomeStyles";


export default function Home() {
    return (
        <View style={homeStyles.homeContainer}>
            <ImageCarousel />
        </View>
    )
}