import { View, Text, TextInput, KeyboardTypeOptions, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { icons } from '@/constants';

interface FormFieldProps {
  title: string;
  value: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
}

const FormField = (
  {
    title,
    value,
    handleChangeText,
    otherStyles,
    placeholder,
    keyboardType,
  }: FormFieldProps
) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-base text-gray-100 font-pmedium ml-2'>{title}</Text>

      <View
        className={`items-center mt-2 flex-row border-2 w-full h-16 px-4 bg-black-100 rounded-2xl ${focused ? 'border-secondary' : 'border-black-200'}`}
      >
        <TextInput
          className='flex-1 text-white font-psemibold text-base'
          value={value}
          placeholder={placeholder}
          placeholderTextColor='#7b7b8b'
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
          keyboardType={keyboardType || 'default'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        {
          title === 'Password' && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className='ml-2'
            >
              <Image
                source={!showPassword ? icons.eye : icons.eyeHide}
                className='w-6 h-6'
                resizeMode='contain'
              />
            </TouchableOpacity>
          )
        }
      </View>
    </View>
  );
};

export default FormField;