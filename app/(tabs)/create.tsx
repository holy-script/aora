import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '@/components/FormField';
import { useVideoPlayer, VideoView } from 'expo-video';
import { icons } from '@/constants';
import CustomButton from '@/components/CustomButton';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { VideoForm } from '@/types';
import { createVideo } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<VideoForm>({
    title: '',
    video: null,
    thumbnail: null,
    prompt: ''
  });
  const player = useVideoPlayer(form.video?.uri || null);

  if (!user) {
    return null;
  }

  const openPicker = async (selectType: 'video' | 'image') => {
    const result = await DocumentPicker.getDocumentAsync({
      type: selectType === 'image'
        ? ['image/png', 'image/jpg', 'image/jpeg']
        : ['video/mp4', 'video/gif']
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }

      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
        player.replace(result.assets[0].uri);
      }
    }
    // else {
    //   setTimeout(() => {
    //     Alert.alert('Document Picked', JSON.stringify(result, null, 2));
    //   }, 100);
    // }
  };

  const submit = async () => {
    if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
      Alert.alert('Please fill all fields');
      return;
    }

    setUploading(true);

    try {
      await createVideo({
        ...form,
        userId: user.$id
      });

      Alert.alert('Success', 'Post uploaded successfully');
      router.push('/home');
    }
    catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        prompt: ''
      });
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView className='px-4 my-6'>
        <Text className='text-2xl text-white font-psemibold'>
          Upload Video
        </Text>

        <FormField
          title='Video Title'
          value={form.title}
          placeholder='Give your video a catchy title...'
          handleChangeText={(text) => setForm({ ...form, title: text })}
          otherStyles='mt-10'
        />

        <View className='mt-7 space-y-2'>
          <Text className='text-base text-gray-100 font-pmedium mb-2'>
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => openPicker('video')}>
            {
              form.video ? (
                <VideoView
                  player={player}
                  style={{
                    width: '100%',
                    height: 200,
                    borderRadius: 20,
                  }}
                />
              ) : (
                <View className='w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center'>
                  <View className='w-14 h-14 border border-dashed border-secondary-100 justify-center items-center'>
                    <Image
                      source={icons.upload}
                      resizeMode='contain'
                      className='w-1/2 h-1/2'
                    />
                  </View>
                </View>
              )
            }
          </TouchableOpacity>
        </View>

        <View className='mt-7 space-y-2'>
          <Text className='text-base text-gray-100 font-pmedium mb-2'>
            Thumbnail Image
          </Text>

          <TouchableOpacity onPress={() => openPicker('image')}>
            {
              form.thumbnail ? (
                <Image
                  source={{ uri: form.thumbnail.uri }}
                  resizeMode='cover'
                  className='w-full h-64 rounded-xl'
                />
              ) : (
                <View className='w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border border-black-200 flex-row space-x-2'>
                  <Image
                    source={icons.upload}
                    resizeMode='contain'
                    className='w-5 h-5'
                  />
                  <Text className='text-sm text-gray-100 font-pmedium ml-1'>
                    Choose a file
                  </Text>
                </View>
              )
            }
          </TouchableOpacity>
        </View>

        <FormField
          title='AI Prompt'
          value={form.prompt}
          placeholder='The prompt you used to create this video'
          handleChangeText={(text) => setForm({ ...form, prompt: text })}
          otherStyles='mt-7'
        />

        <CustomButton
          title='Submit & Publish'
          handlePress={submit}
          isLoading={uploading}
          containerStyles='mt-7'
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;