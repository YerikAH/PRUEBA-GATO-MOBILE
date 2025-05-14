import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../navigation/types";
import { colors, fontSizes, fontStyles } from "../../../../utils";
import { CustomInput, CustomButton } from "../../../../components";
import { registerUser } from "../service";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";
import { RegisterCredentials, RegisterResponse } from "../models";

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Register"
>;

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

const Register = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const password = watch("password");

  const registerMutation = useMutation<
    AxiosResponse<RegisterResponse>,
    AxiosError,
    RegisterCredentials
  >({
    mutationFn: registerUser,
    onSuccess: () => {
      navigation.navigate("Login");
    },
    onError: (error) => {
      console.log(error);
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

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const onSubmit = (data: RegisterFormData) => {
    setErrorMessage("");
    if (data.password !== data.passwordConfirmation) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }
    registerMutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
      passwordConfirmation: data.passwordConfirmation,
    });
  };

  const setTestCredentials = () => {
    setValue("name", "Usuario de Prueba");
    setValue("email", "usuario.prueba@example.com");
    setValue("password", "contraseña123");
    setValue("passwordConfirmation", "contraseña123");
    setErrorMessage("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={styles.subtitle}>
        Únete a nuestra comunidad para disfrutar de todos los beneficios que
        tenemos para ti.
      </Text>

      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="name"
          rules={{
            required: "El nombre es obligatorio",
            minLength: {
              value: 2,
              message: "El nombre debe tener al menos 2 caracteres",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Nombre completo"
              placeholder="Ej. Juan Pérez"
              value={value}
              onChangeText={(text) => {
                onChange(text);
                setErrorMessage("");
              }}
              iconName="person"
              error={errors.name?.message}
            />
          )}
        />

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

        <Controller
          control={control}
          name="passwordConfirmation"
          rules={{
            required: "Confirma tu contraseña",
            validate: (value) =>
              value === password || "Las contraseñas no coinciden",
          }}
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Confirmar contraseña"
              placeholder="Repite tu contraseña"
              value={value}
              onChangeText={(text) => {
                onChange(text);
                setErrorMessage("");
              }}
              secureTextEntry={!showConfirmPassword}
              isPassword
              showPassword={showConfirmPassword}
              onTogglePassword={handleToggleConfirmPassword}
              iconName="lock-closed"
              error={errors.passwordConfirmation?.message}
            />
          )}
        />

        <View style={styles.actionRow}>
          <TouchableOpacity onPress={setTestCredentials}>
            <Text style={styles.testText}>Usar test</Text>
          </TouchableOpacity>
        </View>

        <CustomButton
          title="Registrarme"
          onPress={handleSubmit(onSubmit)}
          loading={registerMutation.isPending}
          style={styles.registerButton}
        />

        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>¿Ya tienes una cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Inicia sesión</Text>
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
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
  },
  testText: {
    color: colors.secondary,
    fontSize: fontSizes.sm,
    ...fontStyles.medium,
  },
  registerButton: {
    width: "100%",
  },
  errorMessage: {
    color: colors.status.error,
    fontSize: fontSizes.sm,
    ...fontStyles.medium,
    textAlign: "center",
    marginTop: 10,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: colors.text.secondary,
    fontSize: fontSizes.sm,
    ...fontStyles.regular,
  },
  loginLink: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    ...fontStyles.medium,
    marginLeft: 5,
  },
});

export default Register;
