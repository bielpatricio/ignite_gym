import { HStack, Heading, Icon, Text, VStack } from 'native-base'
import { Avatar } from './Avatar'

import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { useAuth } from '../hooks/useAuth'

import avatarDefault from '@assets/userPhotoDefault.png'
import { api } from '@services/axios'

export function HomeHeader() {
  const { user, handleSignOut } = useAuth()

  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
      <Avatar
        size={16}
        source={
          user.avatar
            ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
            : avatarDefault
        }
        alt="Avatar"
        mr={4}
      />
      <VStack flex={1}>
        <Text color="gray.100" fontSize="md">
          Hello,
        </Text>

        <Heading color="gray.100" fontSize="md" fontFamily="heading">
          {user.name}
        </Heading>
      </VStack>

      <TouchableOpacity onPress={handleSignOut}>
        <Icon as={MaterialIcons} name="logout" color="indigo.300" size={7} />
      </TouchableOpacity>
    </HStack>
  )
}
