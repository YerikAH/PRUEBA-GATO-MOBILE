import React, { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { colors } from "../../../../utils";
import { createUser } from "../service";
import { RegisterFormData } from "../models";
import { Header, RegisterForm } from "../components";
import { RegisterFormMethods } from "../components/register_form";
import { AvatarPicker } from "../../../../components/avatar_picker";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from "react-native";

const { height: screenHeight } = Dimensions.get("window");

function Register() {
  const navigation = useNavigation();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const formRef = useRef<RegisterFormMethods>(null);
  const queryClient = useQueryClient();

  const refetchUsers = () => {
    queryClient.refetchQueries({
      queryKey: ["users"],
      exact: true,
    });
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: createUser,
    onSuccess: () => {
      setAvatarUri(null);
      formRef.current?.resetForm();

      Toast.show({
        type: "success",
        text1: "Usuario creado",
        text2: "El usuario ha sido registrado exitosamente",
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
        text2: error.message || "No se pudo registrar el usuario",
        position: "bottom",
        visibilityTime: 4000,
      });
    },
  });

  const handleSubmit = (formData: RegisterFormData) => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.dni ||
      !formData.password ||
      !formData.passwordConfirmation
    ) {
      Toast.show({
        type: "warning",
        text1: "Campos incompletos",
        text2: "Todos los campos son obligatorios para registrar un usuario.",
        position: "bottom",
        visibilityTime: 4000,
      });
      return;
    }

    if (formData.password !== formData.passwordConfirmation) {
      Toast.show({
        type: "warning",
        text1: "Contraseñas no coinciden",
        text2: "Las contraseñas ingresadas deben ser iguales.",
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
      text2: "Estamos registrando al usuario, espere un momento.",
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
            <RegisterForm ref={formRef} onSubmit={handleSubmit} />
            <View style={styles.bottomPadding} />
          </KeyboardAwareScrollView>
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
});

export default Register;
