import React from "react";
import HomeStack from './stacks/HomeStack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StoreStack from "./stacks/StoresStack";
import CategoriesStack from "./stacks/CategoriesStack";
import UserProfileStack from "./stacks/ProfileStack";
type BottomTabParamList = {
  HomeTab: undefined;
  StoresTab: undefined;
  CategoriesTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
    const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="StoresTab" component={StoreStack} />
      <Tab.Screen name="CategoriesTab" component={CategoriesStack} />
      <Tab.Screen name="ProfileTab" component={UserProfileStack} />
    </Tab.Navigator>
  );
}