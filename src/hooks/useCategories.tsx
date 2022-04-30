import {useEffect, useState} from 'react';
import productsApi from '../api/productsApi';

import {CategoriesResponse, Category} from '../interfaces/appInterfaces';

export const useCategories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const {data} = await productsApi.get<CategoriesResponse>('/categorias');

    setCategories(data.categorias);

    setIsLoading(false);
  };

  return {categories, isLoading};
};
