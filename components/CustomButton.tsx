import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

interface CustomButtonProps {
  title: string;
  isLoading?: boolean;
  containerStyles?: string;
  textStyles?: string;
  handlePress: () => void;
}

const CustomButton = ({
  title,
  isLoading,
  containerStyles,
  textStyles,
  handlePress,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
      disabled={isLoading}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;