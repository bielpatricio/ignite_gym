import { Center, Heading, Image, ScrollView, Text, VStack } from 'native-base'

import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleGoToSignUp() {
    navigation.navigate('signUp')
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack px={10} flex={1} bg="gray.700" pb={16}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Background image"
          resizeMode="contain"
          position="absolute"
        />
        <Center my={24}>
          <LogoSvg />

          <Text color="gray.100" fontSize="sm">
            Train your mind and body
          </Text>
        </Center>
        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Sign In
          </Heading>

          <Input
            placeholder="e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input placeholder="password" secureTextEntry />

          <Button title="Log-in" />
        </Center>
        <Center mt={24}>
          <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
            Still don&apos;t have access?
          </Text>

          <Button
            onPress={handleGoToSignUp}
            title="Sign-up"
            variant="outline"
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}
