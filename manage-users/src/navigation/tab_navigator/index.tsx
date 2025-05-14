import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Profile from "../../modules/tabs/profile/page";
import Register from "../../modules/tabs/register/page";
import { MainTabParamList } from "../types";
import { colors, fontStyles, fontSizes } from "../../utils";
import HomeStackNavigator from "../home_stack_navigator";

const Tab = createBottomTabNavigator<MainTabParamList>();

const CustomTabBarButton = ({ children, onPress }: any) => (
  <TouchableOpacity
    style={styles.customTabButton}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.registerButtonWrapper}>
      <View style={styles.addButtonContainer}>
        <Ionicons name="add" size={16} color="#FFFFFF" />
      </View>
      <Text
        style={[styles.registerLabel, fontStyles.regular]}
        numberOfLines={1}
      >
        Registrar
      </Text>
    </View>
  </TouchableOpacity>
);

const CustomTabBarLabel = ({
  label,
  focused,
}: {
  label: string;
  focused: boolean;
}) => (
  <Text
    style={[
      styles.tabBarLabel,
      focused ? styles.tabBarLabelActive : styles.tabBarLabelInactive,
      focused ? fontStyles.medium : fontStyles.regular,
    ]}
    numberOfLines={1}
    ellipsizeMode="tail"
  >
    {label}
  </Text>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarShowLabel: true,
        tabBarLabelPosition: "below-icon",
        tabBarLabelStyle: {
          fontSize: fontSizes.xs,
          ...fontStyles.regular,
          marginTop: 2,
          paddingBottom: 8,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          title: "Inicio",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={20}
              color={focused ? colors.primary : colors.text.secondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Register"
        component={Register}
        options={{
          title: "Registrar",
          tabBarIcon: () => null,
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={20}
              color={focused ? colors.primary : colors.text.secondary}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    borderTopWidth: 0,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tabBarLabel: {
    fontSize: fontSizes.xs,
    ...fontStyles.regular,
    textAlign: "center",
  },
  tabBarLabelActive: {
    color: colors.primary,
    fontSize: fontSizes.xs,
    ...fontStyles.semiBold,
  },
  tabBarLabelInactive: {
    color: colors.text.secondary,
    fontSize: fontSizes.xs,
    ...fontStyles.regular,
  },
  customTabButton: {
    justifyContent: "center",
    alignItems: "center",
    top: 4,
  },
  registerButtonWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  addButtonContainer: {
    width: 40,
    height: 25,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  registerLabel: {
    fontSize: fontSizes.xs,
    ...fontStyles.regular,
    color: colors.text.secondary,
    textAlign: "center",
    maxWidth: 70,
    marginTop: 2,
  },
});

export default TabNavigator;
