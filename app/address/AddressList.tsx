import React from "react";
import { View, Text, FlatList, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/EvilIcons";
import { AddressStyles } from "../../sources/styles/AddressStyles";
import { CommonStyles } from "../../sources/styles/common";
import AddressItem from "./AddressItem";
import Button from "../common/Button";

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

export interface addressListProps {
    address: addressProps[];
    status: number;
    count: number;
    next: string;
    prev: string;
}

interface AddressListCompProps {
    addressList: addressProps[];
    setSelectedAddress: React.Dispatch<React.SetStateAction<addressProps>>;
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddressList({ addressList, setSelectedAddress, setShowPopup }: AddressListCompProps) {
    const renderAddressList = (): React.ReactElement => {
        return (
            <FlatList
                data={addressList}
                contentContainerStyle={{ paddingBottom: 50 }}
                renderItem={({ item }) => (
                    <AddressItem address={item} setSelectedAddress={setSelectedAddress} setShowPopup={setShowPopup} />
                )}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled
                showsVerticalScrollIndicator
                ListFooterComponent={
                    <View style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="primary" text="Add Address" onClick={() => { }} />
                    </View>
                }
                ListHeaderComponent={
                    <Text style={CommonStyles.marginVerticalSm}>Saved Address</Text>
                }
                onEndReached={() => console.log("Hey")}
            />
        )
    }
    return (
                <View style={AddressStyles.addressListContainer}>
                    <View style={[CommonStyles.flexRow, CommonStyles.spaceBetween, AddressStyles.addressListHeaderContainer]}>
                        <Text style={AddressStyles.addressHeader}>Select Delivery Address</Text>
                        <Icon name="close" size={30} onPress={() => setShowPopup(false)} />
                    </View>
                    {renderAddressList()}
                </View>
    )
}