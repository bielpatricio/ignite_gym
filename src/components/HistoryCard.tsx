import { HStack, Heading, Text, VStack } from 'native-base'

export function HistoryCard() {
  return (
    <HStack
      w="full"
      px={5}
      py={4}
      mb={3}
      bg="gray.600"
      rounded="md"
      alignItems="center"
      justifyContent="space-between"
    >
      <VStack mr={5} flex={1}>
        <Heading
          color="gray.100"
          fontSize="md"
          textTransform="capitalize"
          numberOfLines={1}
          fontFamily="heading"
        >
          Back
        </Heading>
        <Text color="gray.200" fontSize="lg" numberOfLines={1}>
          Puxada Frontal
        </Text>
      </VStack>

      <Text color="gray.300" fontSize="md">
        12:12
      </Text>
    </HStack>
  )
}
