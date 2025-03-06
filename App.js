import React, { createContext, useContext, useReducer } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';


const places = [
  { id: 1, name: "Токийская башня", category: "Достопримечательности", description: "Одна из самых знаковых достопримечательностей Токио, напоминающая Эйфелеву башню.", imageUrl: 'https://avatars.dzeninfra.ru/get-zen_doc/5375671/pub_61acaf17273c2954480adaaa_61acb2f232fa90290bf958d5/scale_1200', rating: 4.8 },
  { id: 2, name: "Сенсо-дзи", category: "Достопримечательности", description: "Старейший буддийский храм в Токио, расположенный в районе Асакуса.", imageUrl: 'https://res.cloudinary.com/dbm1qiew0/image/upload/blog-images/2018/09/sensoji_image_2.jpg', rating: 4.9 },
  { id: 3, name: "Сибуя Скрэмбл", category: "Достопримечательности", description: "Один из самых оживленных перекрестков мира, символ современного Токио.", imageUrl: 'https://avatars.mds.yandex.net/i?id=9222468f17a4bc05e1fe2f4c9dca8527_l-8497122-images-thumbs&n=13', rating: 4.7 },
  { id: 4, name: "Императорский дворец", category: "Достопримечательности", description: "Официальная резиденция Императора Японии с красивыми садами.", imageUrl: 'https://avatars.mds.yandex.net/i?id=2b42b994c6c0c676be3724df8f84b04e_l-5209122-images-thumbs&n=13', rating: 4.8 },
  
  { id: 5, name: "Sukiyabashi Jiro", category: "Рестораны", description: "Знаменитый суши-ресторан с тремя звездами Мишлен.", imageUrl: 'https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_66c2e708be88356517962f4a_66c2e87a612f9e7730c41ddc/scale_1200', rating: 4.9 },
  { id: 6, name: "Narisawa", category: "Рестораны", description: "Ресторан высокой японской кухни с элементами французского стиля.", imageUrl: 'https://www.now-where.com/media/2856/final3.jpg', rating: 4.8 },
  { id: 7, name: "Ichiran Ramen", category: "Рестораны", description: "Популярный ресторан рамэна с индивидуальными кабинками.", imageUrl: 'https://www.everydayonsales.com/wp-content/uploads/sites/5/2021/01/ichiran-ramen-japan-s597481403_c-1024x603.jpg', rating: 4.7 },
  { id: 8, name: "Kagari Ramen", category: "Рестораны", description: "Известный ресторан цукемен и рамэна с куриным бульоном.", imageUrl: 'https://i.pinimg.com/originals/c5/51/27/c55127501f97244321e1fec79b6af532.jpg', rating: 4.6 },
  
  { id: 9, name: "Парк Уэно", category: "Парки", description: "Один из крупнейших парков Токио, известный своими музеями и цветением сакуры.", imageUrl: 'https://i01.fotocdn.net/s209/82c55ec7851c8dae/public_pin_l/2579769517.jpg', rating: 4.9 },
  { id: 10, name: "Сад Синдзюку Гёэн", category: "Парки", description: "Просторный парк с тремя различными садовыми стилями.", imageUrl: 'https://images.squarespace-cdn.com/content/v1/5d3ee66abacfa00001df6854/1590105199169-SNFLKF8XGXIW29YPPYM3/tokyo-guide-best-gardens-in-tokyo-shinjuku-gyoen.jpg?format=1500w', rating: 4.8 },
  { id: 11, name: "Парк Ёёги", category: "Парки", description: "Популярный парк для прогулок, пикников и уличных выступлений.", imageUrl: 'https://live.staticflickr.com/7608/17022316105_dbd78fa00c_b.jpg', rating: 4.7 },
  { id: 12, name: "Рикугиэн", category: "Парки", description: "Традиционный японский сад эпохи Эдо с красивыми прудами и холмами.", imageUrl: 'https://i.pinimg.com/originals/7c/99/2b/7c992bc23762507a6a2cb2a134366013.jpg', rating: 4.7 }
];


const categories = ["Достопримечательности", "Парки", "Рестораны"];

// ========== CONTEXT API ==========
const PlacesContext = createContext();

const initialState = { places, categories, selectedCategory: null, selectedPlace: null };

const reducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_CATEGORY': return { ...state, selectedCategory: action.payload };
    case 'SELECT_PLACE': return { ...state, selectedPlace: action.payload };
    default: return state;
  }
};

const PlacesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <PlacesContext.Provider value={{ state, dispatch }}>{children}</PlacesContext.Provider>;
};

const usePlaces = () => useContext(PlacesContext);

// ========== КОМПОНЕНТЫ ==========
const CategoryCard = ({ title, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const PlaceItem = ({ place, onPress }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: place.imageUrl }} style={[styles.image, { width: isTablet ? 150 : 100, height: isTablet ? 150 : 100 }]} />
      <Text style={styles.text}>{place.name}</Text>
    </TouchableOpacity>
  );
};

// ========== ЭКРАНЫ ==========
const CategoriesScreen = ({ navigation }) => {
  const { state, dispatch } = usePlaces();
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {state.categories.map(category => (
        <CategoryCard key={category} title={category} onPress={() => {
          dispatch({ type: 'SELECT_CATEGORY', payload: category });
          navigation.navigate('Places', { category });
        }} />
      ))}
    </ScrollView>
  );
};

const PlacesScreen = ({ navigation, route }) => {
  const { category } = route.params;
  const { state, dispatch } = usePlaces();
  const placesInCategory = state.places.filter(place => place.category === category);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {placesInCategory.map(place => (
        <PlaceItem key={place.id} place={place} onPress={() => {
          dispatch({ type: 'SELECT_PLACE', payload: place });
          navigation.navigate('PlaceDetails', { id: place.id });
        }} />
      ))}
    </ScrollView>
  );
};

const PlaceDetailScreen = ({ route }) => {
  const { id } = route.params;
  const { state } = usePlaces();
  const place = state.places.find(p => p.id == id);

  return (
    <View style={styles.container}>
      <Image source={{ uri: place.imageUrl }} style={styles.imageLarge} />
      <Text style={styles.title}>{place.name}</Text>
      <Text style={styles.description}>{place.description}</Text>
      <Text style={styles.rating}>Рейтинг: {place.rating}</Text>
    </View>
  );
};

// ========== НАВИГАЦИЯ ==========
const Stack = createStackNavigator();

export default function App() {
  return (
    <PlacesProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Categories" component={CategoriesScreen} />
          <Stack.Screen name="Places" component={PlacesScreen} />
          <Stack.Screen name="PlaceDetails" component={PlaceDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PlacesProvider>
  );
}

// ========== СТИЛИ ==========
const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  card: { backgroundColor: '#ddd', padding: 20, marginVertical: 10, borderRadius: 8, width: '90%', alignItems: 'center' },
  text: { fontSize: 18, fontWeight: 'bold' },
  image: { borderRadius: 8, marginTop: 10 },
  imageLarge: { width: '100%', height: 200, borderRadius: 10 },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  description: { fontSize: 16, marginTop: 5 },
  rating: { fontSize: 16, marginTop: 5 },
});
