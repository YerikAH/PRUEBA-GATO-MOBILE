import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fontStyles, fontSizes } from "../../utils";

interface Props {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  iconName: any;
  isPassword?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
  error?: string;
}

export const CustomInput: React.FC<Props> = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
  autoCapitalize = "none",
  iconName,
  isPassword = false,
  onTogglePassword,
  showPassword = false,
  error,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
        />
        {isPassword ? (
          <TouchableOpacity onPress={onTogglePassword}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={18}
              color={colors.text.placeholder}
              style={styles.icon}
            />
          </TouchableOpacity>
        ) : (
          <Ionicons
            name={iconName}
            size={18}
            color={colors.text.placeholder}
            style={styles.icon}
          />
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: fontSizes.sm,
    ...fontStyles.medium,
    marginBottom: 8,
    color: colors.text.primary,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.light,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors.status.error,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: fontSizes.sm,
    ...fontStyles.regular,
  },
  icon: {
    marginLeft: 10,
  },
  errorText: {
    color: colors.status.error,
    fontSize: fontSizes.xs,
    ...fontStyles.regular,
    marginTop: 4,
  },
});
