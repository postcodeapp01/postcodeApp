import React from "react";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from "./BottomTabNavigator";

const Drawer = createDrawerNavigator();

export default function MyDrawer() {
    return (
      <Drawer.Navigator screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="Home" component={BottomTabNavigator} />
      </Drawer.Navigator>
    );
  }
  