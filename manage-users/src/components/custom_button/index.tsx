import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { colors, fontStyles, fontSizes } from "../../utils";

interface Props {
  title: string;
  onPress: () => void;
  type?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  loading?: boolean;
  style?: object;
}

export const CustomButton: React.FC<Props> = ({
  title,
  onPress,
  type = "primary",
  disabled = false,
  loading = false,
  style,
}) => {
  const buttonStyle = [
    styles.button,
    type === "primary" && styles.primaryButton,
    type === "secondary" && styles.secondaryButton,
    type === "outline" && styles.outlineButton,
    disabled && styles.disabledButton,
    style,
  ];

  const textStyle = [
    styles.text,
    type === "primary" && styles.primaryText,
    type === "secondary" && styles.secondaryText,
    type === "outline" && styles.outlineText,
    disabled && styles.disabledText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={type === "outline" ? colors.primary : "white"}
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabledButton: {
    backgroundColor: colors.button.disabled,
  },
  text: {
    fontSize: fontSizes.sm,
    ...fontStyles.semiBold,
  },
  primaryText: {
    color: colors.text.inverse,
  },
  secondaryText: {
    color: colors.text.inverse,
  },
  outlineText: {
    color: colors.primary,
  },
  disabledText: {
    color: colors.text.disabled,
  },
});
