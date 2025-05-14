import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SecureStore from "expo-secure-store";

import { RootStackParamList } from "../types";
import { User, useUserStore } from "../../store/userStore";
import { getUserById } from "../../services";
import Login from "../../modules/auth/login/page";
import Register from "../../modules/auth/register/page";
import TabNavigator from "../tab_navigator";

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] =
    useState<keyof RootStackParamList>("Login");
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        const userId = await SecureStore.getItemAsync("userId");

        if (token) {
          if (!userId) {
            throw new Error("No se encontró el ID del usuario");
          }
          const user = await getUserById(userId);
          const userData: User = {
            id: user.data.id,
            name: user.data.name,
            email: user.data.email,
            avatar: user.data.avatar,
          };
          setUser(userData);
          setInitialRoute("MainTabs");
        }
      } catch (error) {
        console.error("Error al verificar token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  if (isLoading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
