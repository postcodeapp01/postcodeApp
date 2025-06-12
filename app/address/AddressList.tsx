import React, { Fragment } from "react";
import { View, Text, FlatList } from "react-native";
import Icon from "@react-native-vector-icons/evil-icons";
import { AddressStyles } from "../../sources/styles/AddressStyles";
import { CommonStyles } from "../../sources/styles/common";
import AddressItem from "./AddressItem";

export interface addressProps {
    id: number,
    label: string,
    houseNumber: string,
    addressLine1: string,
    addressLine2: string,
    state: string,
    city: string,
    pincode: number
}

interface AddressListProps {
    addressList: addressProps[];
    setSelectedAddress: React.Dispatch<React.SetStateAction<addressProps>>;
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddressList({ addressList, setSelectedAddress, setShowPopup }: AddressListProps) {

    const renderAddressList = (): React.ReactElement => {
        return (
            <FlatList 
                data={addressList}
                renderItem={({ item }) => <AddressItem address={item} setSelectedAddress={setSelectedAddress} setShowPopup={setShowPopup} />}
                keyExtractor={(item) => item.id.toString()} 
            />
        )
    }
    return (
        <View style={AddressStyles.addressListContainer}>
            <View style={[CommonStyles.flexRow, CommonStyles.spaceBetween, AddressStyles.addressListHeaderContainer]}>
                <Text style={AddressStyles.addressHeader}>Select Delivery Address</Text>
                <Icon name="close" size={30} onPress={() => setShowPopup(false)} />
            </View>
            <View>
                <Text style={CommonStyles.marginVerticalSm}>Saved Address</Text>
                {renderAddressList()}
            </View>
        </View>
    )
}