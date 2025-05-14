export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Register: undefined;
};

export type HomeStackParamList = {
  HomeList: undefined;
  UpdateUser: {
    userId: string;
    initialData: {
      name: string;
      email: string;
      dni: string;
      avatar?: string;
    };
  };
};
