import React, {useContext, useEffect, useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Image,
} from 'react-native';

import {StackScreenProps} from '@react-navigation/stack';
import {Picker} from '@react-native-picker/picker';

import {ProductsStackParams} from '../navigator/ProductsNavigator';
import {useCategories} from '../hooks/useCategories';
import {useForm} from '../hooks/useForm';
import {ProductsContext} from '../context/ProductsContext';
import {launchCamera} from 'react-native-image-picker';

interface Props
  extends StackScreenProps<ProductsStackParams, 'ProductScreen'> {}

export const ProductScreen = ({navigation, route}: Props) => {
  const {id = '', name = ''} = route.params;

  const [tempUri, setTempUri] = useState<string>();

  const {categories} = useCategories();

  const {loadProductById, addProduct, updateProduct, uploadImage} =
    useContext(ProductsContext);

  const {_id, categoryId, productName, image, form, onChange, setFormvalue} =
    useForm({
      _id: id,
      categoryId: '',
      productName: name,
      image: '',
    });

  useEffect(() => {
    navigation.setOptions({
      title: productName ? productName : 'No Name Product',
    });
  }, [navigation, productName]);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    if (id.length === 0) return;

    const product = await loadProductById(id);

    setFormvalue({
      _id: id,
      categoryId: product.categoria._id,
      image: product.img || '',
      productName,
    });
  };

  const saveOrUpdate = async () => {
    if (id.length > 0) {
      updateProduct(categoryId, productName, id);
    } else {
      const tempCategoryId = categoryId || categories[0]._id;
      const newProduct = await addProduct(tempCategoryId, productName);

      onChange(newProduct._id, '_id');
    }
  };

  const takePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      resp => {
        if (resp.didCancel) return;
        if (!resp.assets![0].uri) return;

        setTempUri(resp.assets![0].uri);
        uploadImage(resp, _id);
      },
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Product Name:</Text>
        <TextInput
          placeholder="Product"
          style={styles.textInput}
          value={productName}
          onChangeText={value => onChange(value, 'productName')}
        />

        {/* Picker / Selector */}
        <Text style={styles.label}>Category:</Text>
        <Picker
          selectedValue={categoryId}
          onValueChange={value => onChange(value, 'categoryId')}>
          {categories.map(category => {
            return (
              <Picker.Item
                key={category._id}
                label={category.nombre}
                value={category._id}
              />
            );
          })}
        </Picker>

        <Button title="Save" onPress={saveOrUpdate} color="#5856D6" />

        {_id.length > 0 && (
          <View style={styles.btnsContainer}>
            <Button
              title="Camera"
              //TODO: implement onPress
              onPress={takePhoto}
              color="#5856D6"
            />

            <View style={{width: 10}} />

            <Button
              title="Gallery"
              //TODO: implement onPress
              onPress={() => {}}
              color="#5856D6"
            />
          </View>
        )}

        {image.length > 0 && !tempUri && (
          <Image
            source={{uri: image}}
            style={{marginTop: 20, width: '100%', height: 300}}
          />
        )}

        {/* TODO: Display temp image */}
        {tempUri && (
          <Image
            source={{uri: tempUri}}
            style={{marginTop: 20, width: '100%', height: 300}}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10,
  },
  label: {
    fontSize: 18,
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderColor: 'rgba(0,0,0,0.2)',
    height: 45,
    marginTop: 5,
    marginBottom: 15,
  },
  btnsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});
