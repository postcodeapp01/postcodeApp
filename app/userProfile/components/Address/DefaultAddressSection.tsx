import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AddressCard from '../Address/AddressCard';
import { Address } from './address';


interface Props {
defaultAddress: Address | null;
onEdit: (a: Address) => void;
onDelete: (id: string) => void;
}


const DefaultAddressSection: React.FC<Props> = ({ defaultAddress, onEdit, onDelete }) => {
if (!defaultAddress) return null;


return (
<View style={styles.container}>
<Text style={styles.title}>Default Address</Text>
<AddressCard
address={defaultAddress}
isDefault
onEdit={onEdit}
onDelete={onDelete}
showMarkDefault={false}
/>
<Text style={styles.title2}>All addresses</Text>
</View>
);
};


const styles = StyleSheet.create({
container: { marginTop: 8 },
title: { paddingHorizontal: 18, fontSize: 16, fontWeight: '500', color: '#000' },
title2: { paddingHorizontal: 18, fontSize: 16, fontWeight: '500', color: '#000', marginBottom: 10 },
});


export default DefaultAddressSection;