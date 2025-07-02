import React from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../../navigators/stacks/HomeStack';
import homeStyles from '../../../sources/styles/HomeStyles';

const HeaderInputBox = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('SearchScreen')}
      style={homeStyles.searchInputContainer}
      activeOpacity={0.8}
    >
      <Icon name="search" size={20} style={homeStyles.searchIcon} />
      <TextInput
        placeholder="Search for fashion"
        style={homeStyles.searchInput}
        editable={false}
        pointerEvents="none"
      />
    </TouchableOpacity>
  );
};

export default HeaderInputBox;
