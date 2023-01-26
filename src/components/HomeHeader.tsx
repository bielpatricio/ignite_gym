import { HStack, Heading, Icon, Text, VStack } from 'native-base'
import { Avatar } from './Avatar'

import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'

export function HomeHeader() {
  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
      <Avatar
        size={16}
        source={{ uri: 'https://github.com/bielpatricio.png' }}
        alt="Avatar"
        mr={4}
      />
      <VStack flex={1}>
        <Text color="gray.100" fontSize="md">
          Hello,
        </Text>

        <Heading color="gray.100" fontSize="md" fontFamily="heading">
          Gabriel
        </Heading>
      </VStack>

      <TouchableOpacity>
        <Icon as={MaterialIcons} name="logout" color="indigo.300" size={7} />
      </TouchableOpacity>
    </HStack>
  )
}
