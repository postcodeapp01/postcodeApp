import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface AddressSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  style?: any;
  debounceMs?: number; 
  onBack: () => void;
}

const AddressSearchBar: React.FC<AddressSearchBarProps> = memo(({
  searchQuery,
  onSearchChange,
  placeholder = "Search addresses...",
  style,
  debounceMs = 800,
  onBack,
}) => {
  const [localQuery, setLocalQuery] = useState<string>(searchQuery ?? '');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchQuery !== localQuery) {
      setLocalQuery(searchQuery ?? '');
    }
  }, [searchQuery]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const triggerParentChange = useCallback((value: string, immediate = false) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (immediate || !debounceMs || debounceMs <= 0) {
      onSearchChange(value);
      return;
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      onSearchChange(value);
    }, debounceMs);
  }, [onSearchChange, debounceMs]);

  const handleTextChange = useCallback((text: string) => {
    setLocalQuery(text);
    triggerParentChange(text);
  }, [triggerParentChange]);

  const clearSearch = useCallback(() => {
    setLocalQuery('');
    triggerParentChange('', true);
  }, [triggerParentChange]);

  return (
    <View style={styles.header}>
      <TouchableOpacity  onPress={onBack}>
              <View style={styles.circleButton}>
      
              <Icon name="arrow-back" size={22} color="#000" />
              </View>
            </TouchableOpacity>
    <View style={[styles.container, style]}>
      <Icon name="search" size={20} color="#AAAAAA" style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={localQuery}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        placeholderTextColor="#AAAAAA"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {localQuery.length > 0 && (
        <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
          <Icon name="close-circle" size={20} color="#666" />
        </TouchableOpacity>
      )}
    </View>
    </View>
  );
});

AddressSearchBar.displayName = 'AddressSearchBar';


const styles = StyleSheet.create({
  header: {
    height: 55, // exact header height preserved
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20, // smaller horizontal padding to give room
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 4,
  },

  circleButton: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },

  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 36, 
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 14,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#AAAAAA',
  },

  searchIcon: {

    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 6,
    backgroundColor:'#fff',
  },

  clearButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddressSearchBar;
