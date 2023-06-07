import { useState } from "react";
import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";
import {
  MediaTypeOptions,
  PermissionStatus,
  launchCameraAsync,
  launchImageLibraryAsync,
  useCameraPermissions,
  useMediaLibraryPermissions,
} from "expo-image-picker";
import "react-native-get-random-values";
import { v4 } from "uuid";
import { AccentBtn, PrimaryBtn } from "~/components/HOC/Button";
import { Colors } from "~/constants/colors";
import FirebaseStorageService from "../../../../packages/firebase/FirebaseStorage";

function ImageSelector({
  onTakeImage,
  editImage,
  basePath,
}: {
  onTakeImage: (imageUri: string) => void;
  editImage?: string | null;
  basePath: string;
}) {
  const [image, setImage] = useState(editImage ? editImage : null);
  const [galleryImage, setGalleryImage] = useState("");
  const [cameraPermissionInfo, requestPermission] = useCameraPermissions();
  const [mediaStatus, requestPermissionMedia] = useMediaLibraryPermissions();
  const [uploadStatus, setUploadStatus] = useState<number>(-1);

  async function verifyPermissions() {
    if (cameraPermissionInfo?.status === PermissionStatus.UNDETERMINED) {
      const permission = await requestPermission();
      return permission.granted;
    }
    if (cameraPermissionInfo?.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Permission was denied",
        "Camera permissions are required to use this app."
      );
      return false;
    }

    return true;
  }

  async function verifyGalleryPermissions() {
    if (mediaStatus?.status === PermissionStatus.UNDETERMINED) {
      const permission = await requestPermissionMedia();
      return permission.granted;
    }
    if (mediaStatus?.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Permission was denied",
        "Gallery permissions will be needed to use this app."
      );
      return false;
    }

    return true;
  }

  async function imageTakerHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }
    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.6,
    });
    setImage(image.assets[0].uri);
    onTakeImage(image.assets[0].uri);
  }

  async function imageSelectorHandler() {
    const hasPermissionforGallery = await verifyGalleryPermissions();
    if (!hasPermissionforGallery) {
      return;
    }
    const generatedFileId = v4();
    const galleryImage = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.6,
    });

    const downloadUrl = await FirebaseStorageService.uploadFile(
      galleryImage.assets[0].uri,
      `${basePath}/${generatedFileId}`,
      setUploadStatus
    );
    console.log(downloadUrl.toString(), "finsh");
    setGalleryImage(downloadUrl.toString());
    onTakeImage(downloadUrl.toString());
  }

  let imagePreview = (
    <Text
      style={{
        color: Colors.bone,
        marginVertical: 7,
        fontFamily: "Prata",
        fontSize: 14,
      }}
    >
      Media
    </Text>
  );

  if (image) {
    imagePreview = (
      <View style={styles.imagePrev}>
        <Image style={styles.image} source={{ uri: image }} />
      </View>
    );
  }

  if (galleryImage) {
    imagePreview = (
      <View style={styles.imagePrev}>
        <Image style={styles.image} source={{ uri: galleryImage }} />
      </View>
    );
  }

  return (
    <View>
      <View>{imagePreview}</View>
      <View style={styles.buttonContainer}>
        <PrimaryBtn text="Camera" onPress={imageTakerHandler} />
        <AccentBtn text="Gallery" onPress={imageSelectorHandler} />
      </View>
    </View>
  );
}

export default ImageSelector;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    width: "80%",
    alignSelf: "center",
    marginBottom: 8,
    justifyContent: "space-evenly",
  },
  imagePrev: {
    width: "80%",
    height: 200,
    justifyContent: "center",
    alignSelf: "center",
    padding: 7,
  },
  image: {
    height: "100%",
    width: "100%",
  },
});
