import React from "react";
import { Image, Text, View } from "react-native";
import homeStyles from "../../sources/styles/HomeStyles";
import { CommonStyles } from "../../sources/styles/common";

const categories = [{id: 1, name: 'Men'}, {id: 2, name: 'Women'}, {id: 3, name: 'Kids'}];

const HeaderCategories: React.FC= () => {

    const renderCategories = (): React.ReactElement => {
        const categoryElements = categories.map((category) => {
            return (
                <View style={homeStyles.categoryBlockContainer} key={category.id}>
                    <View style={homeStyles.categoryBlock} />
                    <Text style={{ textAlign: 'center'}}>{category.name}</Text>
                </View>   
            )
        })

        return (
            <View style={[CommonStyles.flexRow, CommonStyles.spaceBetween]}>
                {categoryElements}
                <View style={homeStyles.categoryBlockContainer}>
                    <View style={[homeStyles.categoryBlock, { borderRadius: 25}]}>
                        <Image source={require('../../sources/images/Diversity.png')} style={{ flexGrow: 1, margin: 10}} />
                    </View>
                    <Text style={{ textAlign: 'center'}}>More</Text>
                </View>
            </View>
        )
    }
    return (
        <View>
            {renderCategories()}
        </View>
    )
}

export default HeaderCategories