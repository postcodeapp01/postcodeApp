import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import homeStyles from "../../../sources/styles/HomeStyles";
import HomeHeaderAddressBox from "../../address/HomeHeaderAddressBox";
import HeaderCategories from "../../address/HeaderCategories";
import withPopup from "../../common/hoc/withPopup";
import AddressList, { addressProps } from "../../address/AddressList";
import { Api } from "../../../config/Api";
import { getItemFromAsyncStorage } from "../../common/utils/asyncStorage/AsyncStorageUtils";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store";
import { getAddressDetails } from "../../address/AddressServices";

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
  }
];

export default function HomeHeader() {
  const [showPopup, setShowPopup] = useState<boolean>(true);
  const [selectedAddress, setSelectedAddress] = useState<addressProps>({});
  const [addressList, setAddressList] = useState<addressProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const userDetails = useSelector((state: RootState) => state.user);

  useEffect(() => {
    (async() => {
      setIsLoading(true);
      const { accessToken } = userDetails;
      console.log(accessToken, 'hello accesToken')
      getAddressDetails(accessToken).then(async (res) => {
        console.log(res, 'hello response');
      }).catch((err) => {
        console.log(`error will getting the address details`, err);
      }).finally(() => {
        setIsLoading(false);
      })
    })();
  }, []);

  const renderAddressPopup = (): React.ReactElement => {
    const WithAddressPopup = withPopup(AddressList, { togglePopup: setShowPopup });
    return (
      <WithAddressPopup
        addressList={addressList}
        setSelectedAddress={setSelectedAddress}
        setShowPopup={setShowPopup}
      />
    );
  };

  if(isLoading) {
    return (
      <Text>Loading...</Text>
    )
  }

  return (
    <>
      {showPopup ? renderAddressPopup() : null}
      <View style={homeStyles.homeHeaderContainer}>
        <HomeHeaderAddressBox
          address={selectedAddress}
          showAddressList={() => setShowPopup(true)}
        />
        {/* 🔍 Removed HeaderInputBox */}
        <HeaderCategories />
      </View>
    </>
  );
}