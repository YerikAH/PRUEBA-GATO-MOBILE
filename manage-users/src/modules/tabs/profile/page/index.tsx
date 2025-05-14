import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  fontStyles,
  fontSizes,
  getAvatarSource,
} from "../../../../utils";
import { useUserStore } from "../../../../store/userStore";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../navigation/types";

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MainTabs"
>;

const Profile = () => {
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("userToken");
      await SecureStore.deleteItemAsync("userId");

      clearUser();

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar la sesión. Inténtalo de nuevo.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={[styles.title]}>Perfil de usuario</Text>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={getAvatarSource(user?.avatar)}
              style={styles.avatar}
            />
          </View>
          <Text style={[styles.name, fontStyles.semiBold]}>{user?.name}</Text>
          <Text style={[styles.email, fontStyles.regular]}>{user?.email}</Text>
        </View>

        <Text style={[styles.sectionTitle, fontStyles.medium]}>Acciones</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionItem} onPress={handleLogout}>
            <View style={styles.optionIconContainer}>
              <Ionicons
                name="log-out-outline"
                size={20}
                color={colors.text.primary}
              />
            </View>
            <Text style={[styles.optionText, fontStyles.regular]}>
              Cerrar sesión
            </Text>
            <View style={styles.optionRight}>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.text.placeholder}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  title: {
    paddingTop: Platform.OS === "android" ? 55 : 0,
    fontSize: fontSizes.md,
    ...fontStyles.semiBold,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: 30,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: colors.background.light,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 45,
  },
  name: {
    fontSize: fontSizes.sm,
    marginBottom: 2,
    color: colors.text.primary,
  },
  email: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editButtonText: {
    color: colors.text.inverse,
  },
  sectionTitle: {
    fontSize: fontSizes.sm,
    color: colors.text.primary,
    marginBottom: 8,
  },
  optionsContainer: {
    backgroundColor: colors.background.light,
    borderRadius: 15,
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  optionIconContainer: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: colors.background.light,
    marginRight: 8,
  },
  optionText: {
    flex: 1,
    fontSize: fontSizes.sm,
    color: colors.text.primary,
  },
  optionRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    backgroundColor: colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  badgeText: {
    color: colors.text.inverse,
    fontSize: fontSizes.xs,
  },
});

export default Profile;
