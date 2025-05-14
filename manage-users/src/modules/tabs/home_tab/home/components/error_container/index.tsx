import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { colors, fontSizes, fontStyles } from "../../../../../../utils";
import { CustomButton } from "../../../../../../components";

export const ErrorContainer: React.FC<{
  queryError: Error;
  refetch: () => void;
}> = ({ queryError, refetch }) => {
  return (
    <View style={styles.container}>
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={30} color={colors.primary} />
        <Text style={styles.errorText}>
          {queryError instanceof Error
            ? queryError.message
            : "Error desconocido"}
        </Text>
        <CustomButton
          title="Reintentar"
          onPress={() => refetch()}
          style={styles.retryButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  errorContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 24,
    backgroundColor: colors.background.main,
    borderRadius: 16,
  },
  errorText: {
    fontSize: fontSizes.sm,
    ...fontStyles.medium,
    color: colors.text.secondary,
    marginTop: 16,
    textAlign: "center",
  },
  retryButton: {
    width: "100%",
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.button.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    ...fontStyles.semiBold,
    color: colors.background.main,
  },
});
