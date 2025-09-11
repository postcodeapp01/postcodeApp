import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


export type Suggestion = { id: string; text: string };


interface Props {
visible: boolean;
suggestions: Suggestion[];
onSelect: (s: Suggestion) => void;
}


const SuggestionsOverlay: React.FC<Props> = ({ visible, suggestions, onSelect }) => {
if (!visible) return null;


return (
<View style={styles.container}>
{suggestions.length === 0 ? (
<View style={styles.item}>
<Text style={styles.noMatch}>No matches found</Text>
</View>
) : (
suggestions.map(s => (
<TouchableOpacity key={s.id} onPress={() => onSelect(s)} style={styles.item}>
<Text numberOfLines={2} style={styles.text}>{s.text}</Text>
</TouchableOpacity>
))
)}
</View>
);
};


const styles = StyleSheet.create({
container: {
marginHorizontal: 16,
backgroundColor: '#FFF',
borderRadius: 8,
borderWidth: 1,
borderColor: '#E0E0E0',
marginBottom: 8,
shadowColor: '#000',
shadowOpacity: 0.06,
shadowOffset: { width: 0, height: 2 },
shadowRadius: 6,
elevation: 2,
},
item: {
paddingHorizontal: 12,
paddingVertical: 10,
borderBottomWidth: 1,
borderBottomColor: '#F0F0F0',
},
text: {
fontSize: 14,
color: '#222',
},
noMatch: {
fontSize: 14,
color: '#888',
},
});


export default SuggestionsOverlay;