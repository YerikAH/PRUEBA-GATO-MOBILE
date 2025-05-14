import React, { useEffect, useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { colors, fontSizes, fontStyles } from "../../../../../utils";
import { updateUserData, deleteUserData } from "../service";
import { UpdateFormData } from "../models";
import { Header, UpdateForm, UpdateFormMethods } from "../components";
import { useNavigation, useRoute } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AvatarPicker } from "../../../../../components";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";

const { height: screenHeight } = Dimensions.get("window");

function Update() {
  const navigation = useNavigation();
  const route = useRoute();
  const queryClient = useQueryClient();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const refetchUsers = () => {
    queryClient.refetchQueries({
      queryKey: ["users"],
      exact: true,
    });
  };

  const { userId, initialData } = route.params as {
    userId: string;
    initialData: UpdateFormData;
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const formRef = useRef<UpdateFormMethods>(null);

  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    if (initialData?.avatar) {
      setAvatarUri(initialData.avatar);
    }
  }, [initialData?.avatar]);

  const hasAvatarChanged = (): boolean => {
    return (
      avatarUri !== initialData.avatar &&
      !(avatarUri === null && initialData.avatar === undefined)
    );
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: UpdateFormData) => {
      return updateUserData(userId, formData, hasAvatarChanged());
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Usuario actualizado",
        text2: "El usuario ha sido actualizado exitosamente",
        position: "bottom",
        visibilityTime: 4000,
      });

      refetchUsers();
      navigation.goBack();
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "No se pudo actualizar el usuario",
        position: "bottom",
        visibilityTime: 4000,
      });
    },
  });

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: () => {
      return deleteUserData(userId);
    },
    onSuccess: () => {
      refetchUsers();
      Toast.show({
        type: "success",
        text1: "Usuario eliminado",
        text2: "El usuario ha sido eliminado exitosamente",
        position: "bottom",
        visibilityTime: 4000,
      });

      navigation.goBack();
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "No se pudo eliminar el usuario",
        position: "bottom",
        visibilityTime: 4000,
      });
    },
  });

  const handleDeleteUser = () => {
    deleteUser();
  };

  const hasDataChanged = (formData: UpdateFormData): boolean => {
    const nameChanged = formData.name !== initialData.name;
    const emailChanged = formData.email !== initialData.email;
    const dniChanged = formData.dni !== initialData.dni;

    const avatarChanged = hasAvatarChanged();

    return nameChanged || emailChanged || dniChanged || avatarChanged;
  };

  const handleSubmit = (formData: UpdateFormData) => {
    if (!formData.name || !formData.email || !formData.dni) {
      Toast.show({
        type: "warning",
        text1: "Campos incompletos",
        text2: "Todos los campos son obligatorios para actualizar un usuario.",
        position: "bottom",
        visibilityTime: 4000,
      });
      return;
    }

    if (!hasDataChanged(formData)) {
      Toast.show({
        type: "info",
        text1: "Sin cambios",
        text2: "No se detectaron cambios en la información del usuario.",
        position: "bottom",
        visibilityTime: 4000,
      });
      return;
    }

    const userData = {
      ...formData,
      avatar: avatarUri || undefined,
    };

    Toast.show({
      type: "info",
      text1: "Procesando...",
      text2: "Estamos actualizando al usuario, espere un momento.",
      position: "bottom",
      visibilityTime: 2000,
    });

    mutate(userData);
  };

  const handleSave = () => {
    formRef.current?.submitForm();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Header onSave={handleSave} loading={isPending} />
          </View>

          <KeyboardAwareScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraScrollHeight={100}
            extraHeight={200}
            keyboardOpeningTime={0}
            showsVerticalScrollIndicator={false}
          >
            <AvatarPicker avatarUri={avatarUri} onSelectAvatar={setAvatarUri} />
            <UpdateForm
              onSubmit={handleSubmit}
              initialData={initialData}
              ref={formRef}
            />
            <View style={styles.bottomPadding} />
          </KeyboardAwareScrollView>

          {!isKeyboardVisible && (
            <View style={styles.deleteButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.deleteButton,
                  isDeleting && styles.disabledButton,
                ]}
                onPress={handleDeleteUser}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="white" />
                  </View>
                ) : (
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.main,
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  headerContainer: {
    backgroundColor: colors.background.main,
    zIndex: 1,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  contentContainer: {
    minHeight: screenHeight * 0.7,
    backgroundColor: colors.background.main,
    paddingBottom: 200,
  },
  bottomPadding: {
    height: 200,
    backgroundColor: colors.background.main,
  },
  deleteButtonContainer: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  deleteButton: {
    backgroundColor: colors.button.disabled,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: fontSizes.sm,
    ...fontStyles.semiBold,
    marginLeft: 10,
  },
});

export default Update;
