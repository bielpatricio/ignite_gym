import {
  VStack,
  Text,
  Icon,
  HStack,
  Heading,
  Image,
  Box,
  ScrollView,
} from 'native-base'
import { TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'

import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'
import { Button } from '@components/Button'

export function Exercise() {
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleGoBack() {
    navigation.goBack()
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
            Puxada Frontal
          </Heading>

          <HStack alignItems="center">
            <BodySvg />
            <Text color="gray.200" ml={1} textTransform="capitalize">
              Back
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView>
        <VStack p={8}>
          <Image
            w="full"
            h={80}
            alt="Exercise name"
            source={{
              uri: 'data:image/jpeg;base64,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',
            }}
            mb={3}
            resizeMode="cover"
            rounded="lg"
          />

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
                  3 series
                </Text>
              </HStack>

              <HStack>
                <RepetitionsSvg />
                <Text color="gray.200" ml="2">
                  12 x
                </Text>
              </HStack>
            </HStack>

            <Button title="Done" />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  )
}
