import { Avatar } from '@components/Avatar'
import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { ScreenHeader } from '@components/ScreenHeader'
import {
  VStack,
  Text,
  ScrollView,
  Center,
  Skeleton,
  Heading,
  useToast,
} from 'native-base'
import { useState } from 'react'
import { Alert, TouchableOpacity } from 'react-native'

import avatarDefault from '@assets/userPhotoDefault.png'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { AppError } from '@utils/AppError'
import { useAuth } from '../hooks/useAuth'
import { api } from '@services/axios'

const PHOTO_SIZE = 33

type FormProfile = {
  name: string
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
  email: string
}

const ProfileFormSchema = yup.object({
  name: yup.string().required('Inform a name.'),
  oldPassword: yup
    .string()
    .min(6, 'Minimum 6 characters.')
    .nullable()
    .transform((value) => value || null),
  newPassword: yup
    .string()
    .min(6, 'Minimum 6 characters.')
    .nullable()
    .transform((value) => value || null),
  confirmNewPassword: yup
    .string()
    .nullable()
    .transform((value) => value || null)
    .oneOf(
      [yup.ref('newPassword'), null],
      'The password is different of confirm password!',
    )
    .when('newPassword', {
      is: (Field: any) => Field,
      then: yup
        .string()
        .nullable()
        .required('Inform the confirm password.')
        .transform((value) => value || null),
    }),
})

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const { user, handleUpdateUserProfile } = useAuth()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormProfile>({
    resolver: yupResolver(ProfileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  })

  async function handleUserImageSelect() {
    setPhotoIsLoading(true)
    try {
      const imageSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (imageSelected.canceled) {
        return
      }

      if (imageSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          imageSelected.assets[0].uri,
        )
        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: 'This Image is too big. Choose one smaller than 5MB.',
            placement: 'top',
            bgColor: 'red.500',
          })
        }

        const fileExtension = imageSelected.assets[0].uri.split('.').pop()

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: imageSelected.assets[0].uri,
          type: `${imageSelected.assets[0].type}/${fileExtension}`,
        } as any

        console.log(photoFile)

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoFile)

        console.log(userPhotoUploadForm)

        const responseAvatar = await api.patch(
          '/users/avatar',
          userPhotoUploadForm,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )

        const userUpdated = user
        userUpdated.avatar = responseAvatar.data.avatar

        await handleUpdateUserProfile(userUpdated)

        toast.show({
          title: 'Avatar changed.',
          placement: 'top',
          bgColor: 'indigo.500',
        })
      }
    } catch (error) {
      console.log(error)
      const isAppError = error instanceof AppError

      const title = isAppError ? error.message : 'Unable to update the Avatar.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setPhotoIsLoading(false)
    }
  }

  async function handleSaveEditions(data: FormProfile) {
    const { oldPassword, newPassword, name } = data

    try {
      setIsLoading(true)
      console.log(data)

      const response = await api.put('/users', {
        name,
        password: newPassword,
        old_password: oldPassword,
      })

      const userUpdated = user
      userUpdated.name = name
      await handleUpdateUserProfile(userUpdated)

      toast.show({
        title: 'User updated with success!',
        placement: 'top',
        bgColor: 'indigo.500',
      })

      reset()
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError ? error.message : 'Unable to update the user.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="indigo.500"
              endColor="indigo.300"
            />
          ) : (
            <Avatar
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                  : avatarDefault
              }
              alt="User Avatar"
              size={PHOTO_SIZE}
            />
          )}

          <TouchableOpacity
            disabled={photoIsLoading}
            onPress={handleUserImageSelect}
          >
            <Text
              color="indigo.300"
              fontSize="md"
              fontWeight="bold"
              mt={2}
              mb={8}
            >
              Change Image
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name="name"
            render={({ field }) => {
              return (
                <Input
                  placeholder="Name"
                  bg="gray.600"
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
                  placeholder="E-mail"
                  bg="gray.600"
                  onChangeText={field.onChange}
                  value={field.value}
                  isDisabled
                />
              )
            }}
          />
        </Center>

        <VStack mt={12} mb={9} px={10}>
          <Heading color="gray.200" fontSize="md" mb={4} fontFamily="heading">
            Change Password
          </Heading>

          <Controller
            control={control}
            name="oldPassword"
            render={({ field }) => {
              return (
                <Input
                  placeholder="Old Password"
                  bg="gray.600"
                  onChangeText={field.onChange}
                  value={field.value}
                  secureTextEntry
                  errorMessage={errors.oldPassword?.message}
                />
              )
            }}
          />
          <Controller
            control={control}
            name="newPassword"
            render={({ field }) => {
              return (
                <Input
                  placeholder="New Password"
                  bg="gray.600"
                  onChangeText={field.onChange}
                  value={field.value}
                  secureTextEntry
                  errorMessage={errors.newPassword?.message}
                />
              )
            }}
          />
          <Controller
            control={control}
            name="confirmNewPassword"
            render={({ field }) => {
              return (
                <Input
                  placeholder="Confirm New Password"
                  bg="gray.600"
                  onChangeText={field.onChange}
                  value={field.value}
                  secureTextEntry
                  errorMessage={errors.confirmNewPassword?.message}
                  onSubmitEditing={handleSubmit(handleSaveEditions)}
                  returnKeyType="send"
                />
              )
            }}
          />

          <Button
            onPress={handleSubmit(handleSaveEditions)}
            title="Save editions"
            mt={4}
            isLoading={isLoading}
          />
        </VStack>
      </ScrollView>
    </VStack>
  )
}
