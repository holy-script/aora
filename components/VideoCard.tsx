import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { VideoData } from '@/types';
import { icons } from '@/constants';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent, useEventListener } from 'expo';

interface VideoCardProps {
  video: VideoData;
}

const VideoCard = (
  { video:
    {
      title,
      video,
      thumbnail,
      creator: { username, avatar }
    }
  }: VideoCardProps
) => {
  const player = useVideoPlayer(video);
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
  useEventListener(player, 'playToEnd', () => {
    player.replay();
    player.pause();
  });

  return (
    <View className='flex-col items-center px-4 mb-14'>
      <View className='flex-row gap-3 items-start'>
        <View className='justify-center items-center flex-row flex-1'>
          <View className='w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5'>
            <Image
              source={{ uri: avatar }}
              className='w-full h-full rounded-lg'
              resizeMode='cover'
            />
          </View>

          <View className='justify-center flex-1 ml-3 gap-y-1'>
            <Text
              className='text-white font-psemibold text-sm'
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className='text-xs text-gray-100 font-pregular'
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>

        <View className='pt-2'>
          <Image
            source={icons.menu}
            className='w-5 h-5'
            resizeMode='contain'
          />
        </View>
      </View>

      {isPlaying ? (
        <VideoView player={player} style={{
          width: '100%',
          height: 210,
          borderRadius: 10.5,
          marginTop: 10.5,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }} />
      ) : (
        <TouchableOpacity
          className='w-full h-60 rounded-xl mt-3 relative justify-center items-center'
          activeOpacity={0.7}
          onPress={() => player.play()}
        >
          <Image
            source={{ uri: thumbnail }}
            className='w-full h-full rounded-xl mt-3'
            resizeMode='cover'
          />
          <Image
            source={icons.play}
            className='w-12 h-12 absolute'
            resizeMode='contain'
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;