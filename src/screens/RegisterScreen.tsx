import React, {useContext, useEffect} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {StackScreenProps} from '@react-navigation/stack';

import {AuthContext} from '../context/AuthContext';
import {WhiteLogo} from '../components/WhiteLogo';
import {useForm} from '../hooks/useForm';
import {loginStyles} from '../theme/loginTheme';
import {Background} from '../components/Background';

interface Props extends StackScreenProps<any, any> {}

export const RegisterScreen = ({navigation}: Props) => {
  const {signUp, errorMessage, removeError} = useContext(AuthContext);

  const {email, password, name, onChange} = useForm({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (errorMessage.length === 0) return;

    Alert.alert('Signup error', errorMessage, [
      {text: 'OK', onPress: removeError},
    ]);
  }, [errorMessage, removeError]);

  const onRegister = () => {
    signUp({nombre: name, correo: email, password});
    Keyboard.dismiss();
  };

  return (
    <>
      <Background />
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={loginStyles.formContainer}>
          {/* Keyboard avoiding view */}
          <WhiteLogo />

          <Text style={loginStyles.title}>Register</Text>

          <Text style={loginStyles.label}>Name:</Text>
          <TextInput
            placeholder="Enter your name"
            placeholderTextColor="rgba(255,255,255,0.4)"
            underlineColorAndroid="white"
            style={[
              loginStyles.inputField,
              Platform.OS === 'ios' && loginStyles.inputFieldIOS,
            ]}
            selectionColor="#fff"
            onChangeText={value => onChange(value, 'name')}
            value={name}
            onSubmitEditing={onRegister}
            autoCapitalize="words"
            autoCorrect={false}
          />

          <Text style={loginStyles.label}>Email:</Text>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="rgba(255,255,255,0.4)"
            keyboardType="email-address"
            underlineColorAndroid="white"
            style={[
              loginStyles.inputField,
              Platform.OS === 'ios' && loginStyles.inputFieldIOS,
            ]}
            selectionColor="#fff"
            onChangeText={value => onChange(value, 'email')}
            value={email}
            onSubmitEditing={onRegister}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={loginStyles.label}>Password:</Text>
          <TextInput
            placeholder="******"
            placeholderTextColor="rgba(255,255,255,0.4)"
            underlineColorAndroid="white"
            style={[
              loginStyles.inputField,
              Platform.OS === 'ios' && loginStyles.inputFieldIOS,
            ]}
            selectionColor="#fff"
            onChangeText={value => onChange(value, 'password')}
            value={password}
            onSubmitEditing={onRegister}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />

          {/* Login Button */}
          <View style={loginStyles.btnContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={loginStyles.btn}
              onPress={onRegister}>
              <Text style={loginStyles.btnText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          {/* Create new account */}
          <TouchableOpacity
            onPress={() => navigation.replace('LoginScreen')}
            activeOpacity={0.8}
            style={loginStyles.btnReturn}>
            <Text style={loginStyles.btnText}>Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};
