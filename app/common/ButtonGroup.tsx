import React, { useCallback } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

interface ButtonGroupProps<T = any> {
    buttonList: { title: string; value: T }[];
    selectedValue?: T;
    setSelectedValue: (value: T) => void;
    isHorizontal?: boolean;
}

const ButtonGroup = ({buttonList = [], selectedValue, setSelectedValue, isHorizontal = false}: ButtonGroupProps) => {
    const renderButton = useCallback(({ item }: { item: { title: string; value: any } }) => {
        const isSelected = selectedValue === item.value;
        
        return (
            <Pressable 
                onPress={() => setSelectedValue(item.value)} 
                style={{ 
                    backgroundColor: isSelected ? '#007AFF' : '#E6E6E6', 
                    paddingHorizontal: 20, 
                    paddingVertical: 5, 
                    borderRadius: 8, 
                    marginRight: 10, 
                    borderWidth: 1,
                    borderColor: isSelected ? '#007AFF' : '#464646',
                    minWidth: 80,
                    alignItems: 'center'
                }}
            >
                <Text style={{ 
                    color: isSelected ? '#FFFFFF' : '#000000',
                    fontWeight: isSelected ? '600' : '400'
                }}>
                    {item.title}
                </Text>
            </Pressable>
        );
    }, [selectedValue, setSelectedValue]);

    const keyExtractor = useCallback((item: { title: string; value: any }) => {
        return item.value.toString();
    }, []);

    if (!buttonList || buttonList.length === 0) {
        return null;
    }

    return (
        <View>
            <FlatList
                data={buttonList}
                renderItem={renderButton}
                horizontal={isHorizontal}
                keyExtractor={keyExtractor}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={isHorizontal ? { paddingRight: 10 } : undefined}
                removeClippedSubviews={false}
                initialNumToRender={buttonList.length}
                maxToRenderPerBatch={buttonList.length}
                windowSize={5}
            />
        </View>
    );
};

export default ButtonGroup;