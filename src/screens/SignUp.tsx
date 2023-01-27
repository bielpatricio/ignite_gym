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
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { api } from '@services/axios'
import { AppError } from '@utils/AppError'
import { useState } from 'react'
import { useAuth } from '@hooks/useAuth'

type FormSignUp = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const signUpSchema = yup.object({
  name: yup.string().required('Inform a name.'),
  email: yup.string().required('Inform a e-mail.').email('E-mail invalid.'),
  password: yup
    .string()
    .required('Inform a password.')
    .min(6, 'Minimum 6 characters.'),
  confirmPassword: yup
    .string()
    .required('Confirm the password.')
    .oneOf(
      [yup.ref('password'), null],
      'The password is different of confirm password!',
    ),
})

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  const { handleSignIn } = useAuth()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormSignUp>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const toast = useToast()

  async function handleSignUp(data: FormSignUp) {
    const { name, email, password } = data
    try {
      setIsLoading(true)
      await api.post('/users', {
        name,
        email,
        password,
      })
      await handleSignIn(email, password)
    } catch (error) {
      setIsLoading(false)
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Error to create a new user. Try again later.'

      toast.show({
        title,
        placement: 'bottom',
        bgColor: 'red.500',
      })
    }
  }

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

          <Controller
            control={control}
            // rules={{ // se nao usar algo como yup ou zod
            //   required: 'inform a name',
            // }}
            name="name"
            render={({ field }) => {
              return (
                <Input
                  placeholder="Name"
                  onChangeText={field.onChange}
                  value={field.value}
                  errorMessage={errors.name?.message}
                />
              )
            }}
          />

          <Controller
            control={control}
            name="email"
            render={({ field }) => {
              return (
                <Input
                  placeholder="e-mail"
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
                />
              )
            }}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => {
              return (
                <Input
                  placeholder="Confirm password"
                  onChangeText={field.onChange}
                  value={field.value}
                  secureTextEntry
                  onSubmitEditing={handleSubmit(handleSignUp)}
                  returnKeyType="send"
                  errorMessage={errors.confirmPassword?.message}
                />
              )
            }}
          />

          <Button
            isLoading={isLoading}
            onPress={handleSubmit(handleSignUp)}
            title="Sign-up"
          />
        </Center>

        <Button
          onPress={handleGoBackToSignIn}
          mt={12}
          title="Back to Sign-in"
          variant="outline"
        />
      </VStack>
    </ScrollView>
  )
}
