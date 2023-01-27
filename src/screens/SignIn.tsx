import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  VStack,
  useToast,
} from 'native-base'

import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '@hooks/useAuth'
import { AppError } from '@utils/AppError'
import { useState } from 'react'

type FormSignIn = {
  email: string
  password: string
}

const signInSchema = yup.object({
  email: yup.string().required('Inform a e-mail.').email('E-mail invalid.'),
  password: yup
    .string()
    .required('Inform a password.')
    .min(6, 'Minimum 6 characters.'),
})

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleGoToSignUp() {
    navigation.navigate('signUp')
  }

  const { handleSignIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormSignIn>({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const toast = useToast()

  async function handleFormSignIn({ email, password }: FormSignIn) {
    try {
      setIsLoading(true)
      await handleSignIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError ? error.message : 'Error login. Try again later.'

      setIsLoading(false)

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
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

          <Controller
            control={control}
            name="email"
            render={({ field }) => {
              return (
                <Input
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={field.onChange}
                  value={field.value}
                  errorMessage={errors.email?.message}
                />
              )
            }}
          />

          <Controller
            control={control}
            name="password"
            render={({ field }) => {
              return (
                <Input
                  placeholder="password"
                  onChangeText={field.onChange}
                  value={field.value}
                  secureTextEntry
                  errorMessage={errors.password?.message}
                  onSubmitEditing={handleSubmit(handleFormSignIn)}
                  returnKeyType="send"
                />
              )
            }}
          />

          <Button
            onPress={handleSubmit(handleFormSignIn)}
            title="Log-in"
            isLoading={isLoading}
          />
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
