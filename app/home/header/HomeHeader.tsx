import React, { useState } from "react";
import { View, TextInput, Text, Image, TouchableOpacity } from "react-native";
import homeStyles from "../../../sources/styles/HomeStyles";
import HeaderInputBox from "./HeaderInputBox";
import HomeHeaderAddressBox from "../../address/HomeHeaderAddressBox";
import HeaderCategories from "../../address/HeaderCategories";
import withPopup from "../../common/hoc/withPopup";
import AddressList, { addressProps } from "../../address/AddressList";

const addressList = [
    {
        id: 1,
        label: 'Home',
        houseNumber: '18-6-661',
        addressLine1: 'Laldarwaza South',
        addressLine2: 'Aliyabad',
        state: 'Telangana',
        city: 'Hyderabad',
        pincode: 500053
    },
    {
        id: 2,
        label: 'Office',
        houseNumber: '18-6-661',
        addressLine1: 'Laldarwaza South',
        addressLine2: 'Near Mahankali temple',
        state: 'Telangana',
        city: 'Hyderabad',
        pincode: 500053
    },
]


export default function HomeHeader() {
    const [showPopup, setShowPopup] = useState<boolean>(true);
    const [selectedAddress, setSelectedAddress]=useState<addressProps>(addressList[0])

    const renderAddressPopup = (): React.ReactElement => {
        const WithAddressPopup = withPopup(AddressList, {  togglePopup: setShowPopup })
        return (
            <WithAddressPopup addressList={addressList} setSelectedAddress={setSelectedAddress} setShowPopup={setShowPopup} />
        )
    }


    return (
        <>
            {showPopup ? renderAddressPopup() : null}
            <View style={homeStyles.homeHeaderContainer}>
                <HomeHeaderAddressBox address={selectedAddress} showAddressList={() => setShowPopup(true)} />
                <HeaderInputBox />
                <HeaderCategories />
            </View>
        </>
    )
}