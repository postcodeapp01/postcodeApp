import React from 'react';
import { Text,View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { addressProps } from './AddressList';
import { CommonStyles } from '../../sources/styles/common';
import { AddressStyles } from '../../sources/styles/AddressStyles';
import { concatAddress } from '../common/utils/common';

type AddressItemProps = {
  address: addressProps;
  setSelectedAddress: React.Dispatch<React.SetStateAction<addressProps>>;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddressItem: React.FC<AddressItemProps> = ({ address, setSelectedAddress, setShowPopup }) => {
  return (
    <TouchableOpacity style={AddressStyles.addressItemContainer} onPress={() =>{ setSelectedAddress(address), setShowPopup(false) }}>
        <View style={[CommonStyles.flexRow, { margin: 0.1, alignItems: 'center' }]}>
          <Icon name='house' size={20} />
          <Text style={[CommonStyles.marginHorizonalSm, { fontWeight: 500 }]}>{address.pincode}  - </Text>
          <Text style={{ fontWeight: 500 }}>{address?.label}</Text>
        </View>
        <Text style={[{ fontSize: 12, lineHeight: 20 }, CommonStyles.marginVerticalSm]}>{concatAddress(address)}</Text>
        <View style={[CommonStyles.flexRow, { margin: 0.1 }]}>
          <TouchableOpacity onPress={(e) => e.stopPropagation()} style={[CommonStyles.marginHorizonalSm, { marginLeft: 0}]}>
            <Text style={CommonStyles.fontWeight}>Edit</Text>
          </TouchableOpacity>
          <Text>|</Text>
          <TouchableOpacity onPress={(e) => e.stopPropagation()} style={CommonStyles.marginHorizonalSm}>
            <Text style={CommonStyles.fontWeight}>Delete</Text>
          </TouchableOpacity>
        </View>
    </TouchableOpacity>
  );
};

export default AddressItem;
