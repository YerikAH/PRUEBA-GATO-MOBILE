import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../navigation/types";
import { colors, fontSizes, fontStyles } from "../../../../utils";
import { CustomInput, CustomButton } from "../../../../components";
import { loginUser } from "../service";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { AxiosResponse, AxiosError } from "axios";
import { LoginResponse, LoginCredentials } from "../models";
import { useUserStore, User } from "../../../../store/userStore";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

type LoginFormData = {
  email: string;
  password: string;
};

const Login = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const setUser = useUserStore((state) => state.setUser);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation<
    AxiosResponse<LoginResponse>,
    AxiosError,
    LoginCredentials
  >({
    mutationFn: loginUser,
    onSuccess: async (response) => {
      try {
        const token = String(response.data.data.token);

        const userData: User = {
          id: response.data.data.user?.id || "",
          name: response.data.data.user?.name || "",
          email: response.data.data.user?.email || "",
          avatar: response.data.data.user?.avatar || "",
        };

        setUser(userData);

        await SecureStore.setItemAsync("userId", userData.id);
        await SecureStore.setItemAsync("userToken", token);

        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        });
      } catch (error) {
        setErrorMessage("Error guardando las credenciales");
      }
    },
    onError: (error) => {
      if (error.response && error.response.data) {
        const errorData = error.response.data as any;
        const errorMsg =
          errorData.message || "Error en el servidor. Inténtalo de nuevo.";
        setErrorMessage(errorMsg);
      } else {
        setErrorMessage("Error en la aplicación. Inténtalo de nuevo.");
      }
    },
  });

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = (data: LoginFormData) => {
    setErrorMessage("");
    loginMutation.mutate(data);
  };

  const setTestCredentials = () => {
    setValue("email", "eve.holt@reqres.in");
    setValue("password", "cityslicka");
    setErrorMessage("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <Text style={styles.subtitle}>
        Nos alegra verte de vuelta. Ingresa con tu cuenta para continuar tu
        experiencia.
      </Text>

      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: "El correo electrónico es obligatorio",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "El formato del correo es inválido",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Correo electrónico"
              placeholder="Ej. desarrollo2@gmail.com"
              value={value}
              onChangeText={(text) => {
                onChange(text);
                setErrorMessage("");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              iconName="mail"
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: "La contraseña es obligatoria",
            minLength: {
              value: 6,
              message: "La contraseña debe tener al menos 6 caracteres",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Contraseña"
              placeholder="Ej. AGsawWgbA25%!"
              value={value}
              onChangeText={(text) => {
                onChange(text);
                setErrorMessage("");
              }}
              secureTextEntry={!showPassword}
              isPassword
              showPassword={showPassword}
              onTogglePassword={handleTogglePassword}
              iconName="lock-closed"
              error={errors.password?.message}
            />
          )}
        />

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={setTestCredentials}
          >
            <Text style={styles.forgotPasswordText}>Usar cuenta de prueba</Text>
          </TouchableOpacity>
        </View>

        <CustomButton
          title="Ingresar"
          onPress={handleSubmit(onSubmit)}
          loading={loginMutation.isPending}
          style={styles.loginButton}
        />

        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿Aún no tienes una cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>Registrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
    padding: 20,
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  title: {
    fontSize: fontSizes["xl"],
    ...fontStyles.bold,
    marginBottom: 4,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    ...fontStyles.regular,
    color: colors.text.secondary,
    marginBottom: 30,
  },
  formContainer: {
    width: "100%",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  forgotPassword: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    ...fontStyles.medium,
  },
  testText: {
    color: colors.secondary,
    fontSize: fontSizes.sm,
    ...fontStyles.medium,
  },
  loginButton: {
    width: "100%",
  },
  errorMessage: {
    color: colors.status.error,
    fontSize: fontSizes.sm,
    ...fontStyles.medium,
    textAlign: "center",
    marginTop: 10,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: {
    color: colors.text.secondary,
    fontSize: fontSizes.sm,
    ...fontStyles.regular,
  },
  registerLink: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    ...fontStyles.medium,
    marginLeft: 5,
  },
});

export default Login;
