import React from 'react';
import {Platform, View} from 'react-native';

export const Background = () => {
  return (
    <View
      style={{
        position: 'absolute',
        top: Platform.OS === 'ios' ? -250 : -435,
        backgroundColor: '#5856D6',
        width: 1000,
        height: 1200,
        transform: [{rotate: '-70deg'}],
      }}
    />
  );
};
