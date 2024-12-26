import { View, Text, TextInput, KeyboardTypeOptions, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { icons } from '@/constants';
import { router, usePathname } from 'expo-router';

interface SearchInputProps {
  initialQuery?: string;
  otherStyles?: string;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
}

const SearchInput = (
  {
    initialQuery,
    otherStyles,
    placeholder,
    keyboardType,
  }: SearchInputProps
) => {
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <View
      className={`items-center mt-2 flex-row border-2 w-full h-16 px-4 bg-black-100 rounded-2xl space-x-4 ${focused ? 'border-secondary' : 'border-black-200'}`}
    >
      <TextInput
        className='flex-1 text-white font-pregular text-base mt-0.5'
        value={query}
        placeholder={placeholder}
        placeholderTextColor='#CDCDE0'
        onChangeText={e => setQuery(e)}
        keyboardType={keyboardType || 'default'}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert('Missing Query', 'Please input something to search results across database');
          }

          if (pathname.startsWith('/search')) {
            router.setParams({ query });
          } else {
            router.push(`/search/${query}`);
          }
        }}
      >
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