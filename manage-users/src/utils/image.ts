import * as FileSystem from "expo-file-system";

export const getMimeType = (uri: string): string => {
  const extension = uri.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "jpg":
    case "jpeg":
      return "data:image/jpeg;base64,";
    case "png":
      return "data:image/png;base64,";
    case "gif":
      return "data:image/gif;base64,";
    case "webp":
      return "data:image/webp;base64,";
    default:
      return "data:image/jpeg;base64,";
  }
};

export const imageToBase64 = async (uri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const mimePrefix = getMimeType(uri);
    return `${mimePrefix}${base64}`;
  } catch (error) {
    console.error("Error al convertir imagen a base64:", error);
    throw new Error("No se pudo procesar la imagen. Intenta de nuevo.");
  }
};

export const saveBase64Image = async (base64: string) => {
  const filename = `${FileSystem.cacheDirectory}image.jpg`;
  await FileSystem.writeAsStringAsync(filename, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return filename;
};

export const getAvatarSource = (avatar: string | undefined | null) => {
  if (!avatar || avatar.trim() === "") {
    return require("../assets/placeholder_user.jpg");
  }
  return { uri: avatar };
};
