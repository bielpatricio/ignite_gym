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

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

const PHOTO_SIZE = 33

type FormProfile = {
  name: string
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}

const ProfileFormSchema = yup.object({
  name: yup.string().required('Inform a name.'),
  oldPassword: yup
    .string()
    .required('Inform a password.')
    .min(6, 'Minimum 6 characters.'),
  newPassword: yup
    .string()
    .required('Inform a password.')
    .min(6, 'Minimum 6 characters.'),
  confirmNewPassword: yup
    .string()
    .required('Confirm the password.')
    .oneOf(
      [yup.ref('newPassword'), null],
      'The password is different of confirm password!',
    ),
})

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [photoSelected, setPhotoSelected] = useState(
    'https://github.com/bielpatricio.png',
  )

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormProfile>({
    resolver: yupResolver(ProfileFormSchema),
    defaultValues: {
      name: 'Biel',
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  const toast = useToast()

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
        setPhotoSelected(imageSelected.assets[0].uri)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  function handleSaveEditions(data: FormProfile) {
    const { oldPassword, newPassword, confirmNewPassword } = data

    if (oldPassword === newPassword) {
      return toast.show({
        title: 'The old password is equal to the new password!',
        placement: 'top',
        bgColor: 'red.500',
      })
    }
    console.log(data)
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
              source={{ uri: photoSelected }}
              alt="User Avatar"
              size={PHOTO_SIZE}
            />
          )}

          <TouchableOpacity onPress={handleUserImageSelect}>
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
          <Input placeholder="E-mail" bg="gray.600" isDisabled />
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
          />
        </VStack>
      </ScrollView>
    </VStack>
  )
}
