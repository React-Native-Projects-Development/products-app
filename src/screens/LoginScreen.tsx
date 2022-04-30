import {StackScreenProps} from '@react-navigation/stack';
import React, {useContext, useEffect} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {Background} from '../components/Background';
import {WhiteLogo} from '../components/WhiteLogo';
import {AuthContext} from '../context/AuthContext';
import {useForm} from '../hooks/useForm';
import {loginStyles} from '../theme/loginTheme';

interface Props extends StackScreenProps<any, any> {}

export const LoginScreen = ({navigation}: Props) => {
  const {signIn, errorMessage, removeError} = useContext(AuthContext);

  const {email, password, onChange} = useForm({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (errorMessage.length === 0) return;

    Alert.alert('Login error', errorMessage, [
      {text: 'OK', onPress: removeError},
    ]);
  }, [errorMessage, removeError]);

  const onLogin = () => {
    signIn({correo: email, password});
    Keyboard.dismiss();
  };

  return (
    <>
      {/* Background */}
      <Background />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={loginStyles.formContainer}>
          {/* Keyboard avoiding view */}
          <WhiteLogo />

          <Text style={loginStyles.title}>Login</Text>

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
            onSubmitEditing={onLogin}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />

          {/* Login Button */}
          <View style={loginStyles.btnContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={loginStyles.btn}
              onPress={onLogin}>
              <Text style={loginStyles.btnText}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* Create new account */}
          <View style={loginStyles.newUserContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.replace('RegisterScreen')}>
              <Text style={loginStyles.btnText}>New Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
