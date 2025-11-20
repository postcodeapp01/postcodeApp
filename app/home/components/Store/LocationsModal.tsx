import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LocationCard from './LocationCard';

interface Location {
  id: string | number;
  name: string;
  address: string;
  rating?: number;
  ratingCount?: string;
  deliveryTime?: string;
  distance: string; // friendly string like "15.18 km"
  isSelected?: boolean;
  rawDistanceMeters?: number; // optional raw meters if you need it
  logo?: string;
}

interface LocationsModalProps {
  visible: boolean;
  locations: Location[]; // already-mapped array
  onClose: () => void;
  onSelectLocation: (location: Location) => void;
  currentLocationId?: string | number;
  initialLocationsToShow?: number;
}

const LocationsModal: React.FC<LocationsModalProps> = ({
  visible,
  locations = [],
  onClose,
  onSelectLocation,
  currentLocationId,
  initialLocationsToShow = 3,
}) => {
  const [showAll, setShowAll] = useState(false);

  const displayedLocations = showAll
    ? locations
    : locations.slice(0, initialLocationsToShow);

  const hasMoreLocations = locations.length > initialLocationsToShow;
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      {/* Overlay - tapping outside closes */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Modal Content */}
      <View style={styles.modalContainer}>
        {/* Header with Gradient Background */}
        
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Nearby Your Location</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>

        {/* Locations List */}
        <ScrollView
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled={locations.length > 0}>
          {displayedLocations.map(location => (
            <TouchableOpacity
              key={location.id}
              onPress={() => {
                onSelectLocation(location);
                onClose();
              }}
              activeOpacity={0.7}>
              <LocationCard
                name={location.name}
                address={location.address}
                rating={location.rating}
                ratingCount={location.ratingCount}
                deliveryTime={location.deliveryTime}
                distance={location.distance}
                isHighlighted={
                  location.isCurrent || location.id === currentLocationId
                }
              />
            </TouchableOpacity>
          ))}

          {/* See All Locations Button */}
          {hasMoreLocations && !showAll && (
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => setShowAll(true)}
              activeOpacity={0.7}>
              <Text style={styles.seeAllText}>
                See all {locations.length} locations
              </Text>
              <Icon name="chevron-down" size={18} color="#666" />
            </TouchableOpacity>
          )}

          {/* Collapse Button */}
          {showAll && hasMoreLocations && (
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => setShowAll(false)}
              activeOpacity={0.7}>
              <Text style={styles.seeAllText}>Collapse</Text>
              <Icon name="chevron-up" size={18} color="#666" />
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  modalContainer: {
    // top:-10,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '85%',
    overflow: 'hidden',
  },

  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal:20,
    paddingVertical:10,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    letterSpacing: 0.2,
  },

  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: '100%',
  },

  seeAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    marginVertical: 8,
  },

  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
});

export default LocationsModal;
