import { Pressable, Text, IPressableProps } from 'native-base'

type GroupProps = IPressableProps & {
  name: string
  isActive: boolean
}

export function Group({ name, isActive, ...rest }: GroupProps) {
  return (
    <Pressable
      mr={3}
      // w={24}
      px={8}
      h={10}
      bg="gray.600"
      rounded="md"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
      isPressed={isActive}
      _pressed={{
        borderColor: 'white',
        borderWidth: 1,
        bg: 'indigo.300',
      }}
      {...rest}
    >
      <Text
        color={isActive ? 'gray.700' : 'gray.200'}
        textTransform="uppercase"
        fontSize="xs"
        fontWeight="bold"
      >
        {name}
      </Text>
    </Pressable>
  )
}
