import * as Location from 'expo-location'
import { useEffect, useState } from "react";
import { Fontisto } from '@expo/vector-icons';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  ScrollView,
  ActivityIndicator 
} from "react-native";
import Emoji from 'react-native-emoji';
const { width:SCREEN_WIDTH } = Dimensions.get("window")

const icons = {
  Clouds: "cloudy",
  Rain: "rain",
  Clear: "day-sunny",
  Atmosphere: "fog",
  Snow: "snowflake",
  Drizzle: "snow",
  Thunderstorm: "lightning",
}

const API_KEY = process.env.API_KEY;

export default function Index() {
  const [ city, setCity ] = useState(<Emoji name="coffee" style={{fontSize: 60}} />)
  const [ days, setDays ] = useState([])
  const [ ok, setOk ] = useState(true);
  const getWeather = async () => {
    //유저의 위치 정보 권한 승인 과정
    const { granted } = await Location.requestForegroundPermissionsAsync()
    if(!granted) { //승인하지 않았을경우
      setOk(false)
    }
    //유저 위치 정보 얻기
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 })
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false })
    setCity(location[0].city)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(
      json.list.filter((weather) => {
        if (weather.dt_txt.includes("00:00:00")) {
          return weather;
        }
      })
    );
  }
  useEffect(() => {
    getWeather()
  },[])

  return (
    <View style={styles.container}>
      {ok ? 
      <>
        <View style={styles.city}>
          <Text style={styles.cityName}>{city}</Text>
        </View>
        <ScrollView 
          pagingEnabled
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weather}>
          {days.length === 0 ? <View style={styles.day}><ActivityIndicator color='white' size='large'/></View> :
          days.map((day, index) => 
            <View key={index} style={styles.day}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={70} color="black" />
              </View>
              <Text style={styles.mainWeather}>{day.weather[0].main}</Text>
              <Text style={styles.description}>{day.weather[0].description}</Text>
            </View>
          )}
        </ScrollView>
      </>
      : <Emoji name="cry" style={{fontSize: 120}} />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato'
  },
  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cityName: {
    fontSize: 68,
    fontWeight: '500'
  },
  weather: {

  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center'
  },
  temp: {
    marginTop: 50,
    fontSize: 120
  },
  mainWeather: {
    marginTop: 30,
    fontSize: 60
  },
  description: {
    fontSize: 30
  }
})