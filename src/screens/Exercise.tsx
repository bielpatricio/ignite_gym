import {
  VStack,
  Text,
  Icon,
  HStack,
  Heading,
  Image,
  Box,
  useToast,
} from 'native-base'
import { TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'

import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'
import { Button } from '@components/Button'
import { useCallback, useEffect, useState } from 'react'
import { api } from '@services/axios'
import { AppError } from '@utils/AppError'
import { ExerciseDTO } from '@dtos/ExerciseDTO'
import { Loading } from '@components/Loading'

type RouteParams = {
  exerciseId: string
}

export function Exercise() {
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const [isLoading, setIsLoading] = useState(true)
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)
  const [sendingRegister, setSendingRegister] = useState(false)

  const route = useRoute()

  const { exerciseId } = route.params as RouteParams

  function handleGoBack() {
    navigation.goBack()
  }

  const toast = useToast()

  const fetchExerciseDetails = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/${exerciseId}`)
      setExercise(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError ? error.message : 'Unable to load the exercise.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast, exerciseId])

  useEffect(() => {
    fetchExerciseDetails()
  }, [fetchExerciseDetails])

  async function handleExerciseHistoryRegister() {
    try {
      setSendingRegister(true)
      await api.post(`/history`, { exercise_id: exerciseId })

      toast.show({
        title: 'Congratulations. Task registered in your history!',
        placement: 'top',
        bgColor: 'indigo.500',
      })

      navigation.navigate('history')
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Unable register the exercise..'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setSendingRegister(false)
    }
  }

  return (
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color="indigo.500" size={6} />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          mt={4}
          mb={8}
          alignItems="center"
        >
          <Heading
            flexShrink={1}
            color="gray.100"
            fontSize="lg"
            fontFamily="heading"
          >
            {exercise.name}
          </Heading>

          <HStack alignItems="center">
            <BodySvg />
            <Text color="gray.200" ml={1} textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <VStack p={8}>
          <Box mb={3} rounded="lg" overflow="hidden">
            <Image
              w="full"
              h={80}
              source={{
                uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
              }}
              alt="Exercise name"
              resizeMode="cover"
              rounded="lg"
            />
          </Box>

          <Box bg="gray.600" rounded="md" pb={4} px={4}>
            <HStack
              alignItems="center"
              justifyContent="space-around"
              mb={6}
              mt={5}
            >
              <HStack>
                <SeriesSvg />
                <Text color="gray.200" ml="2">
                  {exercise.series} series
                </Text>
              </HStack>

              <HStack>
                <RepetitionsSvg />
                <Text color="gray.200" ml="2">
                  {exercise.repetitions} x
                </Text>
              </HStack>
            </HStack>

            <Button
              title="Done"
              onPress={handleExerciseHistoryRegister}
              isLoading={sendingRegister}
            />
          </Box>
        </VStack>
      )}
    </VStack>
  )
}
