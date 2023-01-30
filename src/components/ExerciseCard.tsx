import { HStack, Heading, Image, Text, VStack, Icon } from 'native-base'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { ExerciseDTO } from '@dtos/ExerciseDTO'
import { api } from '@services/axios'

type ExerciseCardProps = TouchableOpacityProps & {
  data: ExerciseDTO
}

export function ExerciseCard({ data, ...rest }: ExerciseCardProps) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg="gray.500"
        alignItems="center"
        p={2}
        pr={4}
        rounded="md"
        mb={3}
      >
        <Image
          source={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`,
          }}
          alt="Exercise Image"
          w={16}
          h={16}
          rounded="md"
          mr={4}
          resizeMode="cover"
        />
        <VStack flex={1}>
          <Heading color="gray.100" fontSize="lg" fontFamily="heading">
            {data.name}
          </Heading>
          <Text color="gray.200" fontSize="sm" mt={1} numberOfLines={2}>
            {data.series} series x {data.repetitions} repetitions
          </Text>
        </VStack>

        <Icon as={Entypo} name="chevron-thin-right" color="gray.300" />
      </HStack>
    </TouchableOpacity>
  )
}
