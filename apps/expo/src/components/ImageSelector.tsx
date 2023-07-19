import { useEffect, useRef, useState } from "react";
import { Alert, Button, Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  MediaTypeOptions,
  PermissionStatus,
  launchCameraAsync,
  launchImageLibraryAsync,
  useCameraPermissions,
  useMediaLibraryPermissions,

} from "expo-image-picker";
import "react-native-get-random-values";
import uuid from "react-native-uuid";
import { Colors } from "~/constants/colors";
import FirebaseStorageService from "../../../../packages/firebase/FirebaseStorage";
import { ImageType } from "./AddForm";
import { AVPlaybackStatusSuccess, ResizeMode, Video } from "expo-av";
import { ScrollView } from "react-native-gesture-handler";
import { Icon } from "./Icon";

function ImageSelector({
  onTakeImage,
  editImage,
  basePath,
  clearImage,
}: {
  onTakeImage: (image: ImageType) => void;
  clearImage:boolean;
  editImage?: string | null;
  basePath: string;
}) {
  const [image, setImage] = useState(editImage ? editImage : null);

  const [galleryImage, setGalleryImage] = useState<{
    url: string;
    type: string;
  } | null>(null);
  const [cameraPermissionInfo, requestPermission] = useCameraPermissions();
  const [mediaStatus, requestPermissionMedia] = useMediaLibraryPermissions();
  const [uploadStatus, setUploadStatus] = useState<number>(-1);
  const video = useRef(null);
  const [status, setStatus] = useState<AVPlaybackStatusSuccess | {}>({});

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

  useEffect(() => {
    if(clearImage){
      setImage(null)
    }
  }, [clearImage])

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
    setImage(image.assets && image.assets[0].uri);
    
    if (image.assets) {
      onTakeImage({ url: image.assets[0].uri, type: image.assets[0].type! });
    }
  }

  async function imageSelectorHandler() {
    const hasPermissionforGallery = await verifyGalleryPermissions();
    if (!hasPermissionforGallery) {
      return;
    }
    const generatedFileId = uuid.v4();
    const galleryImage = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.6,
      videoMaxDuration: 120
   
    });
    
    async function getDownloadURL() {

      if (galleryImage.canceled || !galleryImage.assets || galleryImage.assets.length === 0) {
        // User cancelled the image selection or no assets were returned
        return;
      }
     
      if (galleryImage.assets) {
        console.log(galleryImage.assets, 'file')
    
        const {uri} = galleryImage.assets[0]
        const response = await fetch(uri);
        const blob = await response.blob();

        const downloadUrl = await FirebaseStorageService.uploadFile(
          blob,
          `${basePath}/${generatedFileId}`
        );
        return downloadUrl;
      }
    }
    getDownloadURL().then((response) => {
          if (response && galleryImage.assets) {
        setGalleryImage({
          url: response as string,
          type: galleryImage.assets[0].type!,
        });
        onTakeImage({
          url: response as string,
          type: galleryImage.assets[0].type!,
        });
      }
    });
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
    if (galleryImage.type === "image") {
      
      imagePreview = (
        <View style={styles.imagePrev}>
          <Image style={styles.image} source={{ uri: galleryImage.url }} />
        </View>
      );
    } else if (galleryImage.type === "video") {
      imagePreview = (
        <View className="h-80 w-full mb-2 ">
          <Video
            ref={video}
            style={{ width: "100%", height: "100%",  }}
            source={{
              uri: galleryImage.url,
            }}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            isLooping
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />
        </View>
      );
    }
  }

  return (
<ScrollView >
      <View className="flex">{imagePreview}</View>
      <View style={styles.buttonContainer}>
        <Icon color={Colors.bone} name={"camera-enhance-outline"} onPress={imageTakerHandler} size={30} text="Camera"/>
        {/* <PrimaryBtn text="Camera" onPress={imageTakerHandler} /> */}
        <Icon color={Colors.primaryLight} name={"view-gallery-outline"} onPress={imageSelectorHandler} size={30} text="Gallery"/>
        {/* <AccentBtn text="Gallery" onPress={imageSelectorHandler} /> */}
      </View>
    </ScrollView>
  );
}

export default ImageSelector;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    marginBottom: 8,
    justifyContent: "space-evenly",
  },
  imagePrev: {
    width: '100%',
    height: 200,
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 8,
    border: Colors.niceBlue,
    borderWidth: 1,
    elevation: 10
  
   
  },
  image: {
    height: "100%",
    width: "100%",
  },
});
