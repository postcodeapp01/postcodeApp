import React from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import SuggestionsOverlay from './SuggestionsOverlay';
import UseMyLocationButton from './UseMyLocationButton';
import AddressCard from './AddressCard';
import {Address} from './address';
import AddressSearchBar from './AddressSearchBar';
import LocationPermissionBanner from './LocationPermissionBanner';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../Store';
import { fetchUserLocation } from '../../../../reduxSlices/UserSlice';

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
  navigation: any;
  modal?: boolean;
  onModalClose?: () => void;
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
  navigation,
  modal,
  onModalClose,
}) => {
  const dispatch=useDispatch();
   const locationPermission = useSelector(
    (state: RootState) => state.user.locationPermission,
  );
  const handleEnableLocation = async () => {
    try {
      const resultAction = await dispatch(fetchUserLocation());
      if (fetchUserLocation.fulfilled.match(resultAction)) {
        Alert.alert('Location enabled', 'Location access granted');
      } else {
        const payload = (resultAction as any).payload;
        const errMsg =
          payload || (resultAction as any).error?.message || 'Permission denied';
        Alert.alert('Permission denied', String(errMsg));
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to get location');
    }
  };
  console.log("modal vaule",modal)
  const handleBack = () => {
    if (modal && onModalClose) onModalClose();
    else navigation.goBack();
  };
  return (
    <View>
      {/* CONTROLLED SEARCH BAR */}
      <AddressSearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        placeholder="Search address..."
        onBack={handleBack}
      />

      {/* Suggestions overlay (appears under the search bar inside the header) */}
      {suggestionsVisible && (
        <SuggestionsOverlay
          suggestions={suggestions}
          onSuggestionPress={onSuggestionPress}
        />
      )}
      {!locationPermission && (
        <LocationPermissionBanner onEnable={handleEnableLocation} />
      )}
      {/* NEW: Use My Location Button */}
      <UseMyLocationButton onPress={onUseMyLocationPress} />

      {/* Default Address Section */}
      {displayAddresses.default && (
        <View style={styles.section}>
      
          <AddressCard
            address={displayAddresses.default}
            isDefault
            onEdit={onEdit}
            onDelete={onDelete}
            showMarkDefault={false}
          />
          
        </View>
      )}

      {!displayAddresses.default && (
        <Text style={styles.sectionTitle2}>Select a Delivery Address</Text>
      )}
    </View>
  );
};

export default AddressListHeader;

const styles = StyleSheet.create({
  section: {
    backgroundColor:"#6c3636ff",
    marginTop: 8,
  },
  sectionTitle: {
    paddingHorizontal: 18,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  sectionTitle2: {
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    marginBottom: 10,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
});
