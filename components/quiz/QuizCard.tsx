// components/quiz/QuizCard.tsx
// VERSION CORRIGÉE - Avec ScrollView pour l'explication

import { useTheme } from '@/lib/contexts/ThemeContext';
import type { QuizOption, QuizQuestion } from '@/lib/types/quiz';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { GlassCard } from '../ui/GlassCard';

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (optionId: string) => void;
  showResult?: boolean;
  selectedOptionId?: string;
}

export function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  showResult = false,
  selectedOptionId,
}: QuizCardProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  React.useEffect(() => {
    scale.value = 0;
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  }, [question.id]);

  const handleOptionPress = (optionId: string) => {
    if (showResult) return;
    onAnswer(optionId);
  };

  const getDifficultyColor = () => {
    switch (question.difficulty) {
      case 'easy':
        return colors.success;
      case 'medium':
        return '#f59e0b';
      case 'hard':
        return '#ef4444';
      default:
        return colors.textSecondary;
    }
  };

  const getDifficultyLabel = () => {
    switch (question.difficulty) {
      case 'easy':
        return 'Facile';
      case 'medium':
        return 'Moyen';
      case 'hard':
        return 'Difficile';
      default:
        return '';
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <GlassCard style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.questionNumber, { color: colors.textSecondary }]}>
              Question {questionNumber}/{totalQuestions}
            </Text>
            <View
              style={[
                styles.difficultyBadge,
                {
                  backgroundColor: getDifficultyColor() + '20',
                  borderColor: getDifficultyColor() + '40',
                },
              ]}
            >
              <Text style={[styles.difficultyText, { color: getDifficultyColor() }]}>
                {getDifficultyLabel()}
              </Text>
            </View>
          </View>

          {/* Question */}
          <Text style={[styles.question, { color: colors.text }]}>{question.question}</Text>

          {/* Options */}
          <View style={styles.options}>
            {question.options.map((option, index) => (
              <QuizOption
                key={option.id}
                option={option}
                index={index}
                onPress={() => handleOptionPress(option.id)}
                showResult={showResult}
                isSelected={selectedOptionId === option.id}
              />
            ))}
          </View>

          {/* Explanation (après réponse) */}
          {showResult && selectedOptionId && (
            <Animated.View
              entering={FadeIn.duration(400).delay(500)}
              style={[
                styles.explanation,
                {
                  backgroundColor:
                    question.options.find(o => o.id === selectedOptionId)?.isCorrect
                      ? colors.success + '20'
                      : '#ef4444' + '20',
                  borderColor:
                    question.options.find(o => o.id === selectedOptionId)?.isCorrect
                      ? colors.success + '40'
                      : '#ef4444' + '40',
                },
              ]}
            >
              <Text
                style={[
                  styles.explanationIcon,
                  {
                    color: question.options.find(o => o.id === selectedOptionId)?.isCorrect
                      ? colors.success
                      : '#ef4444',
                  },
                ]}
              >
                {question.options.find(o => o.id === selectedOptionId)?.isCorrect ? '✓' : '✗'}
              </Text>
              <Text style={[styles.explanationText, { color: colors.text }]}>
                {question.explanation}
              </Text>
            </Animated.View>
          )}
        </GlassCard>
      </ScrollView>
    </Animated.View>
  );
}

interface QuizOptionProps {
  option: QuizOption;
  index: number;
  onPress: () => void;
  showResult: boolean;
  isSelected: boolean;
}

function QuizOption({ option, index, onPress, showResult, isSelected }: QuizOptionProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!showResult) {
      scale.value = withSpring(0.97);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getOptionStyle = () => {
    if (!showResult) {
      return {
        backgroundColor: colors.cardBackground,
        borderColor: colors.cardBorder,
      };
    }

    if (isSelected) {
      if (option.isCorrect) {
        return {
          backgroundColor: colors.success + '20',
          borderColor: colors.success,
        };
      } else {
        return {
          backgroundColor: '#ef4444' + '20',
          borderColor: '#ef4444',
        };
      }
    }

    if (option.isCorrect) {
      return {
        backgroundColor: colors.success + '10',
        borderColor: colors.success + '40',
      };
    }

    return {
      backgroundColor: colors.cardBackground,
      borderColor: colors.cardBorder,
      opacity: 0.5,
    };
  };

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <Animated.View style={[styles.optionWrapper, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={showResult}
        style={[
          styles.option,
          getOptionStyle(),
        ]}
      >
        <View
          style={[
            styles.optionLetter,
            {
              backgroundColor:
                showResult && isSelected && option.isCorrect
                  ? colors.success
                  : showResult && isSelected && !option.isCorrect
                  ? '#ef4444'
                  : colors.primary,
            },
          ]}
        >
          <Text style={styles.optionLetterText}>{letters[index]}</Text>
        </View>
        <Text style={[styles.optionText, { color: colors.text }]}>{option.text}</Text>
        {showResult && option.isCorrect && (
          <Text style={[styles.checkmark, { color: colors.success }]}>✓</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Espace pour le bouton "Question suivante"
  },
  card: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  question: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 32,
    marginBottom: 32,
  },
  options: {
    gap: 12,
  },
  optionWrapper: {
    width: '100%',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    gap: 16,
  },
  optionLetter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLetterText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  checkmark: {
    fontSize: 24,
    fontWeight: '700',
  },
  explanation: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  explanationIcon: {
    fontSize: 24,
    fontWeight: '700',
  },
  explanationText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
});