import { Center, Heading, Image, ScrollView, Text, VStack } from 'native-base'

import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'

export function SignUp() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleGoBackToSignIn() {
    // navigation.navigate('signIn')
    navigation.goBack()
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
            Create your account
          </Heading>

          <Input placeholder="Name" />

          <Input
            placeholder="e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input placeholder="password" secureTextEntry />

          <Button title="Sign-up" />
        </Center>

        <Button
          onPress={handleGoBackToSignIn}
          mt={24}
          title="Back to Sign-in"
          variant="outline"
        />
      </VStack>
    </ScrollView>
  )
}
