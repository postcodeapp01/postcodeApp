// import React from 'react';
// import {FlatList, RefreshControl} from 'react-native';

// import AddressCard from './AddressCard';
// import { Address } from './address';

// type Props = {
//   addresses: Address[];
//   refreshing: boolean;
//   onRefresh: () => void;
//   onEdit: (a: Address) => void;
//   onDelete: (id: string) => void;
//   onMarkDefault: (id: string) => void;
// };

// const AddressList: React.FC<Props> = ({addresses, refreshing, onRefresh, onEdit, onDelete, onMarkDefault}) => {
//   return (
//     <FlatList
//       data={addresses}
//       keyExtractor={item => item.id}
//       renderItem={({item}) => (
//         <AddressCard
//           address={item}
//           onEdit={onEdit}
//           onDelete={onDelete}
//           onMarkDefault={onMarkDefault}
//         />
//       )}
//       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//     //   contentContainerStyle={{paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24}}
//       ListEmptyComponent={null}
//       removeClippedSubviews={false}
//     />
//   );
// };

// export default AddressList;
import React, { forwardRef } from 'react';
import { FlatList, ViewStyle, StyleProp } from 'react-native';
import AddressCard from './AddressCard';
import { Address } from './address';


interface Props {
data: Address[];
onEdit: (a: Address) => void;
onDelete: (id: string) => void;
onMarkDefault: (id: string) => void;
isMarkingDefault?: boolean;
refreshing?: boolean;
onRefresh?: () => void;
ListHeaderComponent?: React.ReactNode;
contentContainerStyle?: StyleProp<ViewStyle>;
}


const AddressList = forwardRef<FlatList<Address>, Props>((props, ref) => {
const { data, onEdit, onDelete, onMarkDefault, isMarkingDefault, refreshing, onRefresh, ListHeaderComponent, contentContainerStyle } = props;


return (
<FlatList
ref={ref}
data={data}
keyExtractor={item => item.id}
renderItem={({ item }) => (
<AddressCard
address={item}
onEdit={onEdit}
onDelete={onDelete}
onMarkDefault={onMarkDefault}
isMarkingDefault={isMarkingDefault}
/>
)}
refreshing={refreshing}
onRefresh={onRefresh}
ListHeaderComponent={ListHeaderComponent}
contentContainerStyle={contentContainerStyle}
keyboardShouldPersistTaps="handled"
showsVerticalScrollIndicator={false}
/>
);
});


export default AddressList;