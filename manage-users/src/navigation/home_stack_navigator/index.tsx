import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeStackParamList } from "../types";
import Update from "../../modules/tabs/home_tab/update/page";
import Home from "../../modules/tabs/home_tab/home/page";

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeList" component={Home} />
      <Stack.Screen name="UpdateUser" component={Update} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
