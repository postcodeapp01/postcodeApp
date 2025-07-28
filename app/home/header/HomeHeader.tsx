import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import homeStyles from "../../../sources/styles/HomeStyles";
import HomeHeaderAddressBox from "../../address/HomeHeaderAddressBox";
import HeaderCategories from "../../address/HeaderCategories";
import withPopup from "../../common/hoc/withPopup";
import AddressList, { addressProps, addressListProps } from "../../address/AddressList";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store";
import { getAddressDetails } from "../../address/AddressServices";

export default function HomeHeader() {
  const [showPopup, setShowPopup] = useState<boolean>(true);
  const [selectedAddress, setSelectedAddress] = useState<addressProps>({});
  const [addressList, setAddressList] = useState<addressListProps>({});
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const userDetails = useSelector((state: RootState) => state.user);

  useEffect(() => {
    (async() => {
      setIsLoading(true);
      const { accessToken } = userDetails;
      getAddressDetails(accessToken).then(async (res) => {
        res.address = [...res.address, ...res.address]
        if(res.status === 200) {
          setAddressList(res);
        }
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
        addressList={addressList?.address}
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