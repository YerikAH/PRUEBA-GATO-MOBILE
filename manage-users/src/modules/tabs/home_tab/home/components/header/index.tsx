import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { colors, fontSizes, fontStyles } from "../../../../../../utils";
import { useUserStore } from "../../../../../../store/userStore";
import { CustomAvatar } from "../../../../../../components";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  onRefresh?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh }) => {
  const user = useUserStore((state) => state.user);
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Hola, {user?.name}!</Text>
      <View style={styles.actionsContainer}>
        {onRefresh && (
          <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <Ionicons name="refresh" size={22} color={colors.primary} />
          </TouchableOpacity>
        )}
        <View style={styles.headerAvatar}>
          <CustomAvatar
            imageUrl={user?.avatar}
            name={user?.name || "Usuario"}
            size={40}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: fontSizes.md,
    ...fontStyles.semiBold,
    color: colors.text.primary,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  refreshButton: {
    marginRight: 12,
    padding: 5,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border.medium,
  },
  headerAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border.medium,
  },
});
