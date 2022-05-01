import React, {createContext, useEffect, useState} from 'react';

import {ImagePickerResponse} from 'react-native-image-picker';

import productsApi from '../api/productsApi';
import {Product, ProductsResponse} from '../interfaces/appInterfaces';

type ProductsContextProps = {
  products: Product[];
  loadProducts: () => Promise<void>;
  addProduct: (categoryId: string, productName: string) => Promise<Product>;
  updateProduct: (
    categoryId: string,
    productName: string,
    productId: string,
  ) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  loadProductById: (productId: string) => Promise<Product>;
  uploadImage: (data: any, productId: string) => Promise<void>; //TODO: change ANY
};

export const ProductsContext = createContext({} as ProductsContextProps);

export const ProductsProvider = ({children}: any) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const {data} = await productsApi.get<ProductsResponse>(
      '/productos?limite=50',
    );

    // setProducts(prevState => [...prevState, ...data.productos]);
    setProducts([...data.productos]);
  };

  const addProduct = async (
    categoryId: string,
    productName: string,
  ): Promise<Product> => {
    try {
      const {data} = await productsApi.post<Product>('/productos', {
        nombre: productName,
        categoria: categoryId,
      });

      setProducts(prevState => [...prevState, data]);

      return data;
    } catch (error: any) {
      throw new Error(error.response);
    }
  };

  const updateProduct = async (
    categoryId: string,
    productName: string,
    productId: string,
  ) => {
    try {
      const {data} = await productsApi.put<Product>(`/productos/${productId}`, {
        nombre: productName,
        categoria: categoryId,
      });

      setProducts(prevState => {
        return prevState.map(prod => {
          return prod._id === productId ? data : prod;
        });
      });
    } catch (error: any) {
      console.log(error.response);
    }
  };

  const deleteProduct = async (productId: string) => {};

  const loadProductById = async (productId: string): Promise<Product> => {
    const {data} = await productsApi.get<Product>(`/productos/${productId}`);

    return data;
  };

  const uploadImage = async (data: ImagePickerResponse, productId: string) => {
    const imageData = data.assets![0];
    const fileToUpload = {
      uri: imageData.uri,
      type: imageData.type,
      name: imageData.fileName,
    };

    const formData = new FormData();
    // el nombre que aparece en el body de la peticion
    formData.append('archivo', fileToUpload);
    try {
      const resp = await productsApi.put(
        `/uploads/productos/${productId}`,
        formData,
      );

      console.log(resp.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ProductsContext.Provider
      value={{
        products,
        loadProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        loadProductById,
        uploadImage,
      }}>
      {children}
    </ProductsContext.Provider>
  );
};
