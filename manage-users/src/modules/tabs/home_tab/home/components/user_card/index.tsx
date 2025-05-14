import { User } from "../../models";
import { colors, fontSizes, fontStyles } from "../../../../../../utils";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../../../../../../navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { CustomAvatar } from "../../../../../../components";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { updateUserStatus } from "../../service";
import { useState } from "react";

type NavigationProp = StackNavigationProp<HomeStackParamList, "HomeList">;

export const UserCard: React.FC<{
  user: User;
  handleRefresh: () => void;
}> = ({ user }) => {
  const [switchValue, setSwitchValue] = useState(user.active);
  const navigation = useNavigation<NavigationProp>();

  const { mutate, isPending } = useMutation({
    mutationFn: (newStatus: boolean) => updateUserStatus(user.id, newStatus),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Estado actualizado",
        text2: "El estado del usuario ha sido actualizado",
        position: "bottom",
        visibilityTime: 2000,
      });
    },
    onError: (error: Error) => {
      setSwitchValue(!switchValue);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "No se pudo actualizar el estado del usuario",
        position: "bottom",
        visibilityTime: 4000,
      });
    },
  });

  const handleCardPress = () => {
    navigation.navigate("UpdateUser", {
      userId: user.id,
      initialData: {
        name: user.name,
        email: user.email,
        dni: user.dni || "",
        avatar: user.avatar || undefined,
      },
    });
  };

  const handleToggleActive = () => {
    setSwitchValue(!switchValue);
    mutate(!user.active);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handleCardPress}
      activeOpacity={0.7}
    >
      <View style={styles.userInfo}>
        <CustomAvatar imageUrl={user.avatar || undefined} size={40} />
        <View style={styles.textContainer}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userPhone}>{user.email}</Text>
        </View>
      </View>
      <View style={styles.controls}>
        <Switch
          value={switchValue}
          trackColor={{
            false: colors.border.medium,
            true: colors.status.success,
          }}
          thumbColor={colors.background.main}
          ios_backgroundColor={colors.border.medium}
          style={styles.switch}
          onValueChange={handleToggleActive}
          disabled={isPending}
        />
        {isPending && (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={styles.loader}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.main,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border.medium,
  },
  textContainer: {
    marginLeft: 12,
  },
  userName: {
    fontSize: fontSizes.sm,
    ...fontStyles.semiBold,
    color: colors.text.primary,
  },
  userPhone: {
    fontSize: fontSizes.sm,
    ...fontStyles.regular,
    color: colors.text.secondary,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  loader: {
    marginLeft: 8,
  },
  editButton: {
    marginRight: 12,
    paddingBottom: 6,
  },
});
