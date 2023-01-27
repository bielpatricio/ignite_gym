import { StatusBar, Text } from 'react-native'
import { theme } from './src/styles/themes/default'
import {
  useFonts,
  // eslint-disable-next-line
  Roboto_400Regular,
  // eslint-disable-next-line
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { Loading } from '@components/Loading'
import { NativeBaseProvider } from 'native-base'
import { Routes } from '@routes/index'
// import { Routes } from './src/routes/index'
import { AuthContextProvider } from './src/contexts/AuthContext'

export default function App() {
  // eslint-disable-next-line
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </AuthContextProvider>
    </NativeBaseProvider>
  )
}
