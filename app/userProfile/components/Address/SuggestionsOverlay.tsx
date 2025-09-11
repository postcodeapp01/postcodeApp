import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Suggestion = { id: string; text: string };

type Props = {
  suggestions: Suggestion[];
  onSuggestionPress: (s: Suggestion) => void;
};

const SuggestionsOverlay: React.FC<Props> = ({ suggestions, onSuggestionPress }) => {
  return (
    <View style={styles.suggestionsContainer}>
      {suggestions.length === 0 ? (
        <View style={styles.suggestionItem}>
          <Text style={styles.noMatchText}>No matches found</Text>
        </View>
      ) : (
        suggestions.map(s => (
          <TouchableOpacity
            key={s.id}
            onPress={() => onSuggestionPress(s)}
            style={styles.suggestionItem}>
            <Text numberOfLines={2} style={styles.suggestionText}>
              {s.text}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

export default SuggestionsOverlay;

const styles = StyleSheet.create({
  suggestionsContainer: {
    marginHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 8,
    // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionText: {
    fontSize: 14,
    color: '#222',
  },
  noMatchText: {
    fontSize: 14,
    color: '#888',
  },
});
 