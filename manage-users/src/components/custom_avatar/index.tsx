import React, { useState, useEffect } from "react";
import { View, Image, Animated, Easing, ViewStyle } from "react-native";
import { saveBase64Image, getAvatarSource } from "../../utils";

interface CustomAvatarProps {
  imageUrl?: string;
  size?: number;
  borderRadius?: number;
  style?: any;
}

export const CustomAvatar: React.FC<CustomAvatarProps> = ({
  imageUrl,
  size = 50,
  borderRadius,
  style,
}) => {
  const [isLoading, setIsLoading] = useState(!!imageUrl);
  const [hasError, setHasError] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const pulseAnim = new Animated.Value(0);

  const calculatedBorderRadius =
    borderRadius !== undefined ? borderRadius : size / 2;

  const isValidImageUrl = (url: string): boolean => {
    if (!url) return false;
    if (url.startsWith("file:///")) return true;

    const webUrlRegex = /^(https?:\/\/)/i;

    const base64Regex = /^data:image\/(jpeg|jpg|png|gif|bmp|webp);base64,/i;

    if (webUrlRegex.test(url)) {
      return true;
    }

    return base64Regex.test(url);
  };

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(0);
    }
  }, [isLoading]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading && imageUrl) {
      timeoutId = setTimeout(() => {
        setIsLoading(false);
        setHasError(true);
      }, 10000); // 10 segundos
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, imageUrl]);

  const isBase64Image = (str: string): boolean => {
    return /^data:image\/(png|jpeg|jpg|gif);base64,/.test(str);
  };

  async function saveImageBase64(imageUrl: string) {
    const image = await saveBase64Image(imageUrl);
    setImageBase64(image);
  }

  useEffect(() => {
    if (imageUrl && isBase64Image(imageUrl)) {
      saveImageBase64(imageUrl);
    }
  }, [imageUrl]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: calculatedBorderRadius,
    ...style,
  };

  const skeletonStyle = {
    width: size,
    height: size,
    borderRadius: calculatedBorderRadius,
    backgroundColor: pulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["#e0e0e0", "#f5f5f5"],
    }),
  };

  if (!imageUrl || hasError || (imageUrl && !isValidImageUrl(imageUrl))) {
    return (
      <View style={containerStyle}>
        <Image
          source={getAvatarSource(null)}
          style={{
            width: size,
            height: size,
            borderRadius: calculatedBorderRadius,
          }}
        />
      </View>
    );
  }

  if (imageBase64) {
    return (
      <View style={containerStyle}>
        <Image
          source={{ uri: imageBase64 }}
          style={{
            width: size,
            height: size,
            borderRadius: calculatedBorderRadius,
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Image
        source={{ uri: imageUrl }}
        style={{
          width: size,
          height: size,
          borderRadius: calculatedBorderRadius,
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        fadeDuration={300}
        progressiveRenderingEnabled={true}
      />
    </View>
  );
};
