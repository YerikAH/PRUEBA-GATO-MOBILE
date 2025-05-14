import { View, StyleSheet, ActivityIndicator } from "react-native";
import { colors } from "../../../../../../utils";

export const FooterLoader: React.FC<{ loading: boolean }> = ({ loading }) => {
  if (!loading) return null;

  return (
    <View style={styles.footerLoader}>
      <ActivityIndicator size="small" color={colors.button.disabled} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
    paddingTop: 50,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
