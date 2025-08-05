import React, { useState } from "react";
import { Text, View } from "react-native";
import { Modal } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/EvilIcons";
import homeStyles from "../../../sources/styles/HomeStyles";
import HomeHeaderAddressBox from "../../address/HomeHeaderAddressBox";
import HeaderCategories from "../../address/HeaderCategories";
import AddressList, { addressProps } from "../../address/AddressList";
import { AddressStyles } from "../../../sources/styles/AddressStyles";
import { CommonStyles } from "../../../sources/styles/common";


export default function HomeHeader() {
  const [showPopup, setShowPopup] = useState<boolean>(true);
  const [selectedAddress, setSelectedAddress] = useState<addressProps | {}>({});


  const renderAddressList = () => {
    return (
      <View style={AddressStyles.addressListContainer}>
        <View style={[CommonStyles.flexRow, CommonStyles.spaceBetween, AddressStyles.addressListHeaderContainer]}>
          <Text style={AddressStyles.addressHeader}>Select Delivery Address</Text>
          <Icon name="close" size={30} onPress={() => setShowPopup(false)} />
        </View>
        <AddressList setSelectedAddress={setSelectedAddress} setShowPopup={setShowPopup} />
      </View>
    )
  }

  const renderAddressPopup = (): React.ReactElement => {
    return (
      <SafeAreaProvider>
        <SafeAreaView>
          <Modal 
            visible={showPopup} 
            onRequestClose={() => setShowPopup(false)}
            transparent
          >
            <View style={[CommonStyles.popupContainer, { justifyContent: 'flex-end'}]}>
              <View style={CommonStyles.popupContentContainer}>
                {renderAddressList()}
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </SafeAreaProvider>
    )
  };

  return (
    <>
      {showPopup ? renderAddressPopup() : null}
      <View style={homeStyles.homeHeaderContainer}>
        <HomeHeaderAddressBox
          address={selectedAddress}
          showAddressList={() => setShowPopup(true)}
        />
        <HeaderCategories />
      </View>
    </>
  );
}