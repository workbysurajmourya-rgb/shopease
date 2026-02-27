export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  photo: string | null;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ProductDetail: { product: Product };
};

export type MainTabParamList = {
  Home: undefined;
  Cart: undefined;
  Profile: undefined;
};
