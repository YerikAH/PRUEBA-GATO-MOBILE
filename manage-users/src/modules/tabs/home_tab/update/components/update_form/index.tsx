import React, { forwardRef, useImperativeHandle } from "react";
import { StyleSheet, View } from "react-native";
import { CustomInput } from "../../../../../../components";
import { useForm, Controller } from "react-hook-form";
import { UpdateFormData } from "../../models";

export interface UpdateFormMethods {
  submitForm: () => void;
}

interface UpdateFormProps {
  onSubmit: (data: UpdateFormData) => void;
  initialData?: UpdateFormData;
}

export const UpdateForm = forwardRef<UpdateFormMethods, UpdateFormProps>(
  ({ onSubmit, initialData }, ref) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<UpdateFormData>({
      defaultValues: {
        name: initialData?.name || "",
        email: initialData?.email || "",
        dni: initialData?.dni || "",
      },
    });

    useImperativeHandle(ref, () => ({
      submitForm: handleSubmit(onFormSubmit),
    }));

    const onFormSubmit = (data: UpdateFormData) => {
      onSubmit(data);
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
