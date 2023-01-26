import { HistoryCard } from '@components/HistoryCard'
import { ScreenHeader } from '@components/ScreenHeader'
import { VStack, Text, HStack, Heading, SectionList } from 'native-base'
import { useState } from 'react'

export function History() {
  const [exercises, setExercises] = useState([
    {
      title: '08.01.23',
      data: ['remada frontal'],
    },
    {
      title: '08.01.23',
      data: ['remada unilateral'],
    },
  ])

  return (
    <VStack flex={1}>
      <ScreenHeader title="Exercise history" />

      <SectionList
        sections={exercises}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <HistoryCard />}
        renderSectionHeader={({ section }) => (
          <Heading
            color="gray.200"
            fontSize="md"
            mt={10}
            mb={3}
            fontFamily="heading"
          >
            {section.title}
          </Heading>
        )}
        px={8}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: 'center' }
        }
        ListEmptyComponent={() => (
          <Text color="gray.100" textAlign="center">
            There are no registered exercises yet.{'\n'}
            Shall we exercise today?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  )
}
