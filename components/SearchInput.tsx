import { View, Text, TextInput, KeyboardTypeOptions, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { icons } from '@/constants';

interface SearchInputProps {
  value: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
}

const SearchInput = (
  {
    value,
    handleChangeText,
    otherStyles,
    placeholder,
    keyboardType,
  }: SearchInputProps
) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View
      className={`items-center mt-2 flex-row border-2 w-full h-16 px-4 bg-black-100 rounded-2xl space-x-4 ${focused ? 'border-secondary' : 'border-black-200'}`}
    >
      <TextInput
        className='flex-1 text-white font-pregular text-base mt-0.5'
        value={value}
        placeholder={placeholder}
        placeholderTextColor='#7b7b8b'
        onChangeText={handleChangeText}
        keyboardType={keyboardType || 'default'}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      <TouchableOpacity>
        <Image
          source={icons.search}
          className='w-5 h-5'
          resizeMode='contain'
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;