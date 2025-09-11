import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import CategoriesStyles from '../../sources/styles/categoriesStyles';

const categories = [
    {
        name: 'Mens Wear',
        image: 'https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=800',
        id: 1
    },
    {
        name: 'Womens Wear',
        image: 'https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=800',
        id: 2
    },
    {
        name: 'Kids Wear',
        image: 'https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=800',
        id: 3
    },
    {
        name: 'Accessories',
        image: 'https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=800',
        id: 4
    },
    {
        name: 'Jewellery',
        image: 'https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=800',
        id: 5
    },
    {
        name: 'Foot wear',
        image: 'https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=800',
        id: 6
    },
    {
        name: 'Home & LiftStyles',
        image: 'https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=800',
        id: 7
    },
]


export default function Categories() {

    const renderCategories = () => {
        return categories.map((item) => (
            <TouchableOpacity key={item.id} style={CategoriesStyles.categoryContainer}>
                <Image source={{ uri: item.image}} style={CategoriesStyles.imageContainer} resizeMode="contain" />
                <Text style={{ textAlign: 'center'}}>{item.name}</Text>
            </TouchableOpacity>
        ))
    }
    
    return (
        <View style={CategoriesStyles.mainContainer}>
            <Text>Offers will be implemented soon</Text>
            {renderCategories()}
        </View>
    )
}