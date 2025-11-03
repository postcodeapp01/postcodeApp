// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// type Suggestion = { id: string; text: string };

// type Props = {
//   suggestions: Suggestion[];
//   onSuggestionPress: (s: Suggestion) => void;
// };
// const SuggestionsOverlay: React.FC<Props> = ({ suggestions, onSuggestionPress }) => {
//   console.log("suggestions",suggestions);
//   return (
//     <View style={styles.suggestionsContainer}>
//       {suggestions.length === 0 ? (
//         <View style={styles.suggestionItem}>
//           <Text style={styles.noMatchText}>No matches found</Text>
//         </View>
//       ) : (
//         suggestions.map(s => (
//           <TouchableOpacity
//             key={s.id}
//             onPress={() => onSuggestionPress(s)}
//             style={styles.suggestionItem}>
//             <Text numberOfLines={2} style={styles.suggestionText}>
//               {s.text}
//             </Text>
//           </TouchableOpacity>
//         ))
//       )}
//     </View>
//   );
// };

// export default SuggestionsOverlay;

// const styles = StyleSheet.create({
//   suggestionsContainer: {
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     marginBottom: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 6,
//     elevation: 2,
//     zIndex: 10,
//   },
//   suggestionItem: {
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//   },
//   suggestionText: {
//     fontSize: 14,
//     color: '#222',
//   },
//   noMatchText: {
//     fontSize: 14,
//     color: '#888',
//   },
// });
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Suggestion = {id: string; text: string};

type Props = {
  suggestions: Suggestion[];
  onSuggestionPress: (s: Suggestion) => void;
};

const SuggestionsOverlay: React.FC<Props> = ({
  suggestions,
  onSuggestionPress,
}) => {
  console.log('suggestions', suggestions);

  return (
    <View style={styles.suggestionsContainer}>
      {suggestions.length === 0 ? (
        <View style={styles.suggestionItem}>
          <Ionicons name="location-outline" size={20} color="#999" />
          <Text style={styles.noMatchText}>No matches found</Text>
        </View>
      ) : (
        suggestions.map(s => (
          <TouchableOpacity
            key={s.id}
            onPress={() => onSuggestionPress(s)}
            style={styles.suggestionItem}
            activeOpacity={0.7}>
            {/* Location Icon */}
            <View style={styles.iconContainer}>
              <Ionicons name="location-outline" size={20} color="#222" />
            </View>

            {/* Suggestion Text */}
            <Text numberOfLines={2} style={styles.suggestionText}>
              {s.text}
            </Text>

            {/* Arrow Icon */}
            <View style={styles.iconContainer}>
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#222"
                style={{transform: [{rotate: '-45deg'}]}}
              />
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

export default SuggestionsOverlay;

const styles = StyleSheet.create({
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    // marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    elevation: 2,
    zIndex: 10,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: '#222',
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing:-0.32,
  },
  noMatchText: {
    flex: 1,
    fontSize: 14,
    color: '#888',
    marginLeft: 12,
  },
});
