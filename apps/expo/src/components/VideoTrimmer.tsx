// import  { useState, useRef } from 'react';
// import { View, TouchableOpacity, Text } from 'react-native';
// import { Video } from 'expo-av';
// import { VideoPlayer, Trimmer } from 'react-native-video-processing';

// const VideoTrimmerComponent = ({ sourceUri }) => {
//   const videoRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [trimmedVideoUri, setTrimmedVideoUri] = useState(null);

//   const handlePlayPause = async () => {
//     if (videoRef.current) {
//       if (isPlaying) {
//         await videoRef.current.pauseAsync();
//       } else {
//         await videoRef.current.playAsync();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const handleTrimVideo = async () => {
//     const options = {
//       startTime: 0, // Start time in seconds
//       endTime: 10, // End time in seconds
//       outputFormat: 'mp4', // Output format, can be 'mp4' or 'mpeg'
//     };

//     try {
//       const trimmedUri = await Trimmer.trim(sourceUri, options);
//       setTrimmedVideoUri(trimmedUri);
//     } catch (error) {
//       console.error('Error trimming video:', error);
//     }
//   };

//   return (
//     <View>
//       {trimmedVideoUri ? (
//         <Video
//           ref={videoRef}
//           source={{ uri: trimmedVideoUri }}
//           style={{ width: 300, height: 200 }}
       
//           useNativeControls
//           onPlaybackStatusUpdate={(status) => setIsPlaying(status.isPlaying)}
//         />
//       ) : (
//         <Video
//           ref={videoRef}
//           source={{ uri: sourceUri }}
//           style={{ width: 300, height: 200 }}
         
//           useNativeControls
//           onPlaybackStatusUpdate={(status) => setIsPlaying(status.isPlaying)}
//         />
//       )}

//       <TouchableOpacity onPress={handlePlayPause}>
//         <Text>{isPlaying ? 'Pause' : 'Play'}</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={handleTrimVideo}>
//         <Text>Trim Video</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default VideoTrimmerComponent;