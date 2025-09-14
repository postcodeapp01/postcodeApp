import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
// import AddressSearchBar from '../../components/Address/AddressSearchBar';

import SuggestionsOverlay from './SuggestionsOverlay';
import UseMyLocationButton from './UseMyLocationButton';
import AddressCard from './AddressCard';
import {Address} from './address';
import AddressSearchBar from './AddressSearchBar';

type DisplayAddresses = {
  default: Address | null;
  others: Address[];
};

type Props = {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  suggestions: Array<{id: string; text: string}>;
  suggestionsVisible: boolean;
  onSuggestionPress: (s: {id: string; text: string}) => void;
  onUseMyLocationPress: () => void;
  displayAddresses: DisplayAddresses;
  onEdit: (a: Address) => void;
  onDelete: (id: string) => void;
};

const AddressListHeader: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  suggestions,
  suggestionsVisible,
  onSuggestionPress,
  onUseMyLocationPress,
  displayAddresses,
  onEdit,
  onDelete,
}) => {
  return (
    <View>
      {/* CONTROLLED SEARCH BAR */}
      <AddressSearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        placeholder="Search your addresses..."
      />

      {/* Suggestions overlay (appears under the search bar inside the header) */}
      {suggestionsVisible && (
        <SuggestionsOverlay
          suggestions={suggestions}
          onSuggestionPress={onSuggestionPress}
        />
      )}

      {/* NEW: Use My Location Button */}
      <UseMyLocationButton onPress={onUseMyLocationPress} />

      {/* Default Address Section */}
      {displayAddresses.default && (
        <View style={styles.section}>
          {/* <Text style={styles.sectionTitle}>Default Address</Text> */}
          <AddressCard
            address={displayAddresses.default}
            isDefault
            onEdit={onEdit}
            onDelete={onDelete}
            showMarkDefault={false}
          />
          {/* <Text style={styles.sectionTitle2}>All addresses</Text> */}
        </View>
      )}

      {!displayAddresses.default && (
        <Text style={styles.sectionTitle2}>All addresses</Text>
      )}
    </View>
  );
};

export default AddressListHeader;

const styles = StyleSheet.create({
  section: {
    // backgroundColor:"#6c3636ff",
    marginTop: 8,
  },
  sectionTitle: {
    paddingHorizontal: 18,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  sectionTitle2: {
    paddingHorizontal: 18,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 10,
  },
});
