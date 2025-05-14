import { colors, fontSizes, fontStyles } from "../../../../../../utils";
import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Animated } from "react-native";

const SkeletonAnimation = ({ children }: { children: React.ReactNode }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity]);

  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
};

export const UserCardSkeleton: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.userInfo}>
        <SkeletonAnimation>
          <View style={[styles.avatar, styles.skeleton]} />
        </SkeletonAnimation>
        <View style={styles.textContainer}>
          <SkeletonAnimation>
            <View style={[styles.skeletonText, { width: 120 }]} />
          </SkeletonAnimation>
          <SkeletonAnimation>
            <View style={[styles.skeletonText, { width: 150, marginTop: 6 }]} />
          </SkeletonAnimation>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.main,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
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
  skeleton: {
    backgroundColor: colors.border.light,
  },
  skeletonText: {
    height: 14,
    borderRadius: 4,
    backgroundColor: colors.border.light,
  },
  skeletonCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border.light,
  },
  skeletonSwitch: {
    width: 36,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.border.light,
  },
});
