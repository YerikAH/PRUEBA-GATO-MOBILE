import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { StyleSheet, View } from "react-native";
import { CustomInput } from "../../../../../components";
import { useForm, Controller } from "react-hook-form";
import { RegisterFormData } from "../../models";

export interface RegisterFormMethods {
  submitForm: () => void;
  resetForm: () => void;
}

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
}

export const RegisterForm = forwardRef<RegisterFormMethods, RegisterFormProps>(
  ({ onSubmit }, ref) => {
    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<RegisterFormData>({
      defaultValues: {
        name: "",
        email: "",
        dni: "",
        password: "",
        passwordConfirmation: "",
      },
    });

    const [showPassword, setShowPassword] = React.useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
      React.useState(false);

    useImperativeHandle(ref, () => ({
      submitForm: handleSubmit(onSubmit),
      resetForm: () => {
        reset({
          name: "",
          email: "",
          dni: "",
          password: "",
          passwordConfirmation: "",
        });
        setShowPassword(false);
        setShowPasswordConfirmation(false);
      },
    }));

    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };

    const toggleShowPasswordConfirmation = () => {
      setShowPasswordConfirmation(!showPasswordConfirmation);
    };

    return (
      <View style={styles.form}>
        <Controller
          control={control}
          name="name"
          rules={{
            required: "El nombre es obligatorio",
            minLength: {
              value: 3,
              message: "El nombre debe tener al menos 3 caracteres",
            },
            maxLength: {
              value: 50,
              message: "El nombre no puede tener más de 50 caracteres",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Nombre"
              placeholder="Ej. Juan Perez"
              value={value}
              onChangeText={onChange}
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
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Ingresa un correo electrónico válido",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Correo"
              placeholder="Ej. juan@gmail.com"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              iconName="mail"
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="dni"
          rules={{
            required: "El DNI es obligatorio",
            minLength: {
              value: 8,
              message: "El DNI debe tener al menos 8 caracteres",
            },
            maxLength: {
              value: 12,
              message: "El DNI no puede tener más de 12 caracteres",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="DNI"
              placeholder="Ej. 12345678"
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
              iconName="card"
              error={errors.dni?.message}
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
            maxLength: {
              value: 20,
              message: "La contraseña no puede tener más de 20 caracteres",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Contraseña"
              placeholder="Ej. FsaGSAW%!Gs097"
              value={value}
              onChangeText={onChange}
              secureTextEntry={!showPassword}
              iconName="lock-closed"
              isPassword={true}
              onTogglePassword={toggleShowPassword}
              showPassword={showPassword}
              error={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="passwordConfirmation"
          rules={{
            required: "Debes confirmar la contraseña",
            validate: (value, formValues) =>
              value === formValues.password || "Las contraseñas no coinciden",
          }}
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Repetir contraseña"
              placeholder="Ej. FsaGSAW%!Gs097"
              value={value}
              onChangeText={onChange}
              secureTextEntry={!showPasswordConfirmation}
              iconName="lock-closed"
              isPassword={true}
              onTogglePassword={toggleShowPasswordConfirmation}
              showPassword={showPasswordConfirmation}
              error={errors.passwordConfirmation?.message}
            />
          )}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});
