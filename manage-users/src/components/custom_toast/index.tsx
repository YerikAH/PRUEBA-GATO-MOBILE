import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { BaseToast, ErrorToast, ToastConfig } from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { colors, fontStyles, fontSizes } from "../../utils";

const successIcon = () => (
  <View style={styles.iconContainer}>
    <Ionicons name="checkmark-circle" size={24} color={colors.status.success} />
  </View>
);

const errorIcon = () => (
  <View style={styles.iconContainer}>
    <Ionicons name="close-circle" size={24} color={colors.status.error} />
  </View>
);

const infoIcon = () => (
  <View style={styles.iconContainer}>
    <Ionicons name="information-circle" size={24} color={colors.status.info} />
  </View>
);

const warningIcon = () => (
  <View style={styles.iconContainer}>
    <Ionicons name="warning" size={24} color={colors.status.warning} />
  </View>
);

export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={styles.successToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.title}
      text2Style={styles.message}
      renderLeadingIcon={successIcon}
    />
  ),
  error: (props) => (
    <BaseToast
      {...props}
      style={styles.errorToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.title}
      text2Style={styles.message}
      renderLeadingIcon={errorIcon}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={styles.infoToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.title}
      text2Style={styles.message}
      renderLeadingIcon={infoIcon}
    />
  ),
  warning: (props) => (
    <BaseToast
      {...props}
      style={styles.warningToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.title}
      text2Style={styles.message}
      renderLeadingIcon={warningIcon}
    />
  ),
};

const styles = StyleSheet.create({
  successToast: {
    borderLeftColor: colors.status.success,
    backgroundColor: colors.background.main,
    borderRadius: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorToast: {
    borderLeftColor: colors.status.error,
    backgroundColor: colors.background.main,
    borderRadius: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoToast: {
    borderLeftColor: colors.status.info,
    backgroundColor: colors.background.main,
    borderRadius: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  warningToast: {
    borderLeftColor: colors.status.warning,
    backgroundColor: colors.background.main,
    borderRadius: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contentContainer: {
    paddingHorizontal: 8,
  },
  title: {
    fontSize: fontSizes.sm,
    ...fontStyles.bold,
    color: colors.text.primary,
  },
  message: {
    fontSize: fontSizes.sm,
    ...fontStyles.regular,
    color: colors.text.secondary,
  },
  iconContainer: {
    paddingLeft: 8,
    justifyContent: "center",
  },
});
