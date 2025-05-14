import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fontStyles, fontSizes } from "../../../../../utils";
import { CustomButton } from "../../../../../components";
import { useNavigation } from "@react-navigation/native";

interface HeaderProps {
  onSave: () => void;
  loading: boolean;
}

export const Header = ({ onSave, loading }: HeaderProps) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Crear usuario</Text>
      <CustomButton
        title="Guardar"
        onPress={onSave}
        loading={loading}
        style={styles.saveButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 16 : 0,
    height: 60,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: fontSizes.md,
    ...fontStyles.semiBold,
    color: colors.text.primary,
  },
  saveButton: {
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
});
