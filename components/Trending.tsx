import { View, Text, FlatList, TextStyle, ViewStyle, ImageStyle, TouchableOpacity, ImageBackground, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { VideoData } from '@/types';
import * as Animatable from 'react-native-animatable';
import { icons } from '@/constants';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent, useEventListener } from 'expo';

const animations: {
  [key: string]: Animatable.CustomAnimation<TextStyle & ViewStyle & ImageStyle>;
} = {
  zoomIn: {
    0: {
      transform: [{ scale: 0.9 }],
    },
    1: {
      transform: [{ scale: 1.1 }],
    },
  },
  zoomOut: {
    0: {
      transform: [{ scale: 1.1 }],
    },
    1: {
      transform: [{ scale: 0.9 }],
    },
  },
};

const { zoomIn, zoomOut } = animations;

interface TrendingProps {
  videos: VideoData[];
}

interface TrendingItemProps {
  activeItemId: VideoData['$id'];
  video: VideoData;
}

const TrendingItem = (
  {
    video,
    activeItemId,
  }: TrendingItemProps
) => {
  const player = useVideoPlayer(video.video,);
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
  useEventListener(player, 'playToEnd', () => {
    player.replay();
    player.pause();
  });

  return (
    <Animatable.View
      className='mr-5 relative'
      animation={
        (video.$id === activeItemId) ? zoomIn : zoomOut
      }
    >
      {isPlaying ? (
        <VideoView
          player={player}
          style={{
            width: 182,
            height: 252,
            borderRadius: 30.625,
            marginVertical: 17.5,
            backgroundColor: 'white',
          }}
          contentFit='contain'
        />) : (
        <TouchableOpacity
          className='justify-center items-center'
          activeOpacity={0.7}
          onPress={() => player.play()}
        >
          <ImageBackground
            source={{ uri: video.thumbnail }}
            className='w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40'
            resizeMode='cover'
          />
          <Image
            source={icons.play}
            className='w-12 h-12 absolute'
            resizeMode='contain'
          />
        </TouchableOpacity>)}
    </Animatable.View>
  );
};

const Trending = (
  {
    videos,
  }: TrendingProps
) => {
  const [activeItem, setActiveItem] = useState(videos[0]);

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem
          video={item}
          activeItemId={activeItem.$id}
        />
      )}
      onViewableItemsChanged={
        ({ viewableItems }) => {
          if (viewableItems.length) {
            setActiveItem(viewableItems[0].item);
          }
        }
      }
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70
      }}
      contentOffset={{ x: 170, y: 0 }}
      horizontal
      contentContainerStyle={{
        paddingLeft: 72,
        paddingRight: 72,
      }}
    />
  );
};

export default Trending;