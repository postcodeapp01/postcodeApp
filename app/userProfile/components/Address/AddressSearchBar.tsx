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
  debounceMs?: number; // optional, defaults to 800ms
}

const AddressSearchBar: React.FC<AddressSearchBarProps> = memo(({
  searchQuery,
  onSearchChange,
  placeholder = "Search addresses...",
  style,
  debounceMs = 800,
}) => {
  // local state so typing feels instant
  const [localQuery, setLocalQuery] = useState<string>(searchQuery ?? '');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // keep local in sync when parent explicitly changes searchQuery
  useEffect(() => {
    if (searchQuery !== localQuery) {
      setLocalQuery(searchQuery ?? '');
    }
  }, [searchQuery]);

  // cleanup timer on unmount
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
    // update local immediately so input is smooth
    setLocalQuery(text);
    // inform parent only after debounce
    triggerParentChange(text);
  }, [triggerParentChange]);

  const clearSearch = useCallback(() => {
    setLocalQuery('');
    // clear immediately in parent (so overlays/list clear quickly)
    triggerParentChange('', true);
  }, [triggerParentChange]);

  return (
    <View style={[styles.container, style]}>
      <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={localQuery}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}
        // keep default keyboard behaviour
      />
      {localQuery.length > 0 && (
        <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
          <Icon name="close-circle" size={20} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
});

AddressSearchBar.displayName = 'AddressSearchBar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 4,
  },
  clearButton: {
    padding: 2,
  },
});

export default AddressSearchBar;
