import Icon from '@react-native-vector-icons/fontawesome6';
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import homeStyles from '../../sources/styles/HomeStyles';
import { CommonStyles } from '../../sources/styles/common';
import { concatAddress } from '../common/utils/common';

type IHomeHeaderAddressBoxProps = {
    address: any,
    showAddressList: (asdf: boolean) => void
}

export default function HomeHeaderAddressBox({ address, showAddressList} : IHomeHeaderAddressBoxProps) {

    return (
        <>
            <TouchableOpacity style={[CommonStyles.spaceBetween]} onPress={() => showAddressList(true)}>
                <View style={homeStyles.addressLabelContainer}>
                    <View style={[CommonStyles.flexRow, { marginRight: 10}]}>
                        <Icon name="location-dot" color="Black" size={16} iconStyle="solid"/>
                        <Text style={homeStyles.addressLabelText}>{address.label.toUpperCase()}</Text>
                        <Text style={CommonStyles.fontWeight500}>|</Text>
                    </View>
                    <Text numberOfLines={1} ellipsizeMode="tail">{concatAddress(address)}</Text>
                </View>
                <Icon name="angle-down" iconStyle="solid" />
            </TouchableOpacity>
        </>
    )
}