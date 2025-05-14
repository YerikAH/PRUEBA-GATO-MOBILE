import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Text,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { colors, fontStyles, fontSizes, getAvatarSource } from "../../utils";
import { CustomButton } from "../../components";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CROP_SIZE = Math.min(SCREEN_WIDTH - 60, 300);

interface AvatarPickerProps {
  avatarUri?: string | null;
  onSelectAvatar: (uri: string) => void;
}

export const AvatarPicker = ({
  avatarUri,
  onSelectAvatar,
}: AvatarPickerProps) => {
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const isAndroid = Platform.OS === "android";

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const calculateBounds = () => {
    const scaledWidth = imageSize.width * scale.value;
    const scaledHeight = imageSize.height * scale.value;

    const xMax = Math.max(0, (scaledWidth - CROP_SIZE) / 2);
    const xMin = -xMax;
    const yMax = Math.max(0, (scaledHeight - CROP_SIZE) / 2);
    const yMin = -yMax;

    return { xMin, xMax, yMin, yMax };
  };

  const applyBoundaries = () => {
    const { xMin, xMax, yMin, yMax } = calculateBounds();

    translateX.value = Math.min(xMax, Math.max(xMin, translateX.value));
    translateY.value = Math.min(yMax, Math.max(yMin, translateY.value));
  };

  const handleZoom = (zoomIn: boolean) => {
    const currentScale = scale.value;
    const newScale = zoomIn ? currentScale * 1.2 : currentScale / 1.2;
    const minScale = Math.max(
      0.2,
      (CROP_SIZE / Math.max(imageSize.width, imageSize.height)) * 0.7
    );

    scale.value = withTiming(Math.max(minScale, Math.min(newScale, 2.5)), {
      duration: 200,
    });
    savedScale.value = scale.value;

    setTimeout(() => {
      applyBoundaries();
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    }, 250);
  };

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      applyBoundaries();
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const pinchGesture = Gesture.Pinch()
    .runOnJS(true)
    .onUpdate((event) => {
      const newScale = savedScale.value * event.scale;
      const minScale = Math.max(
        0.5,
        CROP_SIZE / Math.max(imageSize.width, imageSize.height)
      );
      scale.value = Math.max(minScale, Math.min(newScale, 2.5));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      applyBoundaries();
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .runOnJS(true)
    .onStart(() => {
      if (scale.value !== imageSize.width * 2) {
        scale.value = scale.value * 2;
      } else {
        scale.value = Math.round(scale.value / 2);
      }
    });

  const combinedGesture = Gesture.Race(panGesture, pinchGesture, doubleTap);

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Necesitamos permisos para acceder a tus fotos para seleccionar un avatar.",
          [{ text: "OK" }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        aspect: [1, 1],
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        const fileType = selectedAsset.uri
          .substring(selectedAsset.uri.lastIndexOf(".") + 1)
          .toLowerCase();

        if (fileType !== "jpg" && fileType !== "jpeg" && fileType !== "png") {
          Alert.alert(
            "Formato no válido",
            "Por favor, selecciona una imagen en formato JPG o PNG.",
            [{ text: "OK" }]
          );
          return;
        }

        setSelectedImage(selectedAsset.uri);

        Image.getSize(
          selectedAsset.uri,
          (width, height) => {
            setImageSize({ width, height });
            let initialScale = Math.max(CROP_SIZE / width, CROP_SIZE / height);

            initialScale = Math.min(initialScale, 1.2);

            translateX.value = 0;
            translateY.value = 0;
            savedTranslateX.value = 0;
            savedTranslateY.value = 0;
            scale.value = initialScale;
            savedScale.value = initialScale;

            setShowCropModal(true);
          },
          (error) => {
            console.error("Error al obtener dimensiones:", error);
            Alert.alert("Error", "No se pudo cargar la imagen seleccionada");
          }
        );
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
      Alert.alert("Error", "Ocurrió un error al seleccionar la imagen");
    }
  };

  const cropImage = async () => {
    try {
      if (!selectedImage || !imageSize.width) return;

      if (isAndroid) {
        // Enfoque completamente diferente para Android
        // Crear una "captura" exacta de lo que se ve en la pantalla
        // En lugar de calcular coordenadas, usamos la imagen ya escalada y transformada

        const manipResult = await ImageManipulator.manipulateAsync(
          selectedImage,
          [
            {
              // Aplicar exactamente la misma transformación y escala que se ve en pantalla
              // Esta es la clave: aplicamos TODAS las transformaciones juntas
              resize: {
                width: imageSize.width * scale.value,
                height: imageSize.height * scale.value,
              },
            },
            {
              // Luego recortamos un círculo exacto en el centro del CROP_SIZE
              crop: {
                originX:
                  (imageSize.width * scale.value) / 2 -
                  CROP_SIZE / 2 +
                  translateX.value,
                originY:
                  (imageSize.height * scale.value) / 2 -
                  CROP_SIZE / 2 +
                  translateY.value,
                width: CROP_SIZE,
                height: CROP_SIZE,
              },
            },
          ],
          { compress: 0.95, format: ImageManipulator.SaveFormat.PNG }
        );

        onSelectAvatar(manipResult.uri);
      } else {
        // Mantener el enfoque original para iOS que ya funciona bien
        const { width: origWidth, height: origHeight } = imageSize;
        const currentScale = scale.value;

        const visibleWidth = CROP_SIZE / currentScale;
        const visibleHeight = CROP_SIZE / currentScale;

        const imageCenterX = origWidth / 2;
        const imageCenterY = origHeight / 2;

        const offsetX = -translateX.value / currentScale;
        const offsetY = -translateY.value / currentScale;

        const cropX = imageCenterX - visibleWidth / 2 + offsetX;
        const cropY = imageCenterY - visibleHeight / 2 + offsetY;

        const safeX = Math.max(0, Math.min(cropX, origWidth - visibleWidth));
        const safeY = Math.max(0, Math.min(cropY, origHeight - visibleHeight));

        const manipResult = await ImageManipulator.manipulateAsync(
          selectedImage,
          [
            {
              crop: {
                originX: safeX,
                originY: safeY,
                width: visibleWidth,
                height: visibleHeight,
              },
            },
          ],
          { compress: 1, format: ImageManipulator.SaveFormat.PNG }
        );

        onSelectAvatar(manipResult.uri);
      }

      setShowCropModal(false);
      setSelectedImage(null);
    } catch (error) {
      console.error("Error al recortar imagen:", error);
      Alert.alert("Error", "Ocurrió un error al recortar la imagen");
      setShowCropModal(false);
    }
  };

  const cancelCrop = () => {
    setShowCropModal(false);
    setSelectedImage(null);
  };

  return (
    <>
      <View style={styles.avatarContainer}>
        <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <Image source={getAvatarSource(null)} style={styles.avatar} />
          )}
          <View style={styles.cameraButton}>
            <Ionicons name="camera" size={18} color={colors.text.inverse} />
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showCropModal}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Recortar imagen</Text>

              <View style={styles.cropContainer}>
                <View
                  style={[
                    styles.cropFrame,
                    isAndroid && styles.cropFrameAndroid,
                  ]}
                >
                  {selectedImage && (
                    <GestureDetector gesture={combinedGesture}>
                      <Animated.View
                        style={[styles.imageContainer, animatedImageStyle]}
                      >
                        <Image
                          source={{ uri: selectedImage }}
                          style={{
                            width: imageSize.width,
                            height: imageSize.height,
                          }}
                          resizeMode="contain"
                        />
                      </Animated.View>
                    </GestureDetector>
                  )}
                </View>

                <View style={styles.zoomControls}>
                  <TouchableOpacity
                    onPress={() => handleZoom(false)}
                    style={styles.zoomButton}
                  >
                    <Ionicons
                      name="remove"
                      size={20}
                      color={colors.text.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleZoom(true)}
                    style={styles.zoomButton}
                  >
                    <Ionicons
                      name="add"
                      size={20}
                      color={colors.text.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.modalInstructions}>
                Arrastra la imagen para ajustar el área de recorte. La parte
                visible en el círculo será exactamente lo que se recortará.
              </Text>

              <View style={styles.modalButtons}>
                <CustomButton
                  title="Cancelar"
                  onPress={cancelCrop}
                  type="outline"
                  style={styles.modalButton}
                />
                <CustomButton
                  title="Recortar"
                  onPress={cropImage}
                  style={[styles.modalButton, { backgroundColor: "#4800B0" }]}
                />
              </View>
            </View>
          </View>
        </GestureHandlerRootView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgb(185, 185, 185)",
  },
  cameraButton: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: colors.primary,
    width: 30,
    height: 30,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: colors.background.main,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: fontSizes.md,
    ...fontStyles.semiBold,
    color: colors.text.primary,
  },
  cropContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  cropFrame: {
    width: CROP_SIZE,
    height: CROP_SIZE,
    overflow: "hidden",
    borderRadius: 500,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  cropFrameAndroid: {
    // Soluciona problemas de renderizado en Android
    overflow: "hidden",
    elevation: 0,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomControls: {
    flexDirection: "row",
    marginTop: 16,
    width: CROP_SIZE,
    gap: 24,
    justifyContent: "space-between",
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.light,
    justifyContent: "center",
    alignItems: "center",
  },
  modalInstructions: {
    fontSize: fontSizes.sm,
    ...fontStyles.regular,
    textAlign: "center",
    marginBottom: 15,
    color: colors.text.secondary,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  modalButton: {
    width: "48%",
  },
});
