// components/game/GameInfoCard.tsx
// VERSION FINALE - Icônes compactes, ressources en bas bien visibles

import { useTheme } from '@/lib/contexts/ThemeContext';
import type { Game } from '@/lib/data/clank-mock';
import { haptics } from '@/lib/services/haptics';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

interface GameInfoCardProps {
  game: Game;
}

export function GameInfoCard({ game }: GameInfoCardProps) {
  const { colors, theme } = useTheme();
  const [showVideosModal, setShowVideosModal] = useState(false);

  const handleOpenPdf = async () => {
    haptics.light();
    if (game.rulesPdfUrl) {
      await Linking.openURL(game.rulesPdfUrl);
    }
  };

  const handleOpenBGG = async () => {
    haptics.light();
    if (game.boardGameGeekUrl) {
      await Linking.openURL(game.boardGameGeekUrl);
    }
  };

  const handleOpenVideo = async (url: string) => {
    haptics.light();
    await Linking.openURL(url);
  };

  const formatPlayTime = () => {
    if (game.playTime.min === game.playTime.max) {
      return `${game.playTime.min}'`;
    }
    return `${game.playTime.min}-${game.playTime.max}'`;
  };

  const formatPlayerCount = () => {
    if (game.playerCount.min === game.playerCount.max) {
      return `${game.playerCount.min}`;
    }
    return `${game.playerCount.min}-${game.playerCount.max}`;
  };

  return (
    <>
      <View style={[styles.container, { borderColor: colors.cardBorder }]}>
        <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.blur}>
          <LinearGradient
            colors={
              theme === 'dark'
                ? (['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)'] as const)
                : (['rgba(0, 0, 0, 0.03)', 'rgba(0, 0, 0, 0.01)'] as const)
            }
            style={styles.content}
          >
            {/* Infos essentielles - ligne très compacte */}
            <View style={styles.essentialRow}>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {formatPlayerCount()} joueurs
              </Text>
              <Text style={[styles.dot, { color: colors.textTertiary }]}>·</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {formatPlayTime()}
              </Text>
              <Text style={[styles.dot, { color: colors.textTertiary }]}>·</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {game.minAge}+
              </Text>
              {game.boardGameGeekRating && (
                <>
                  <Text style={[styles.dot, { color: colors.textTertiary }]}>·</Text>
                  <Pressable onPress={handleOpenBGG} hitSlop={8}>
                    <Text style={[styles.bggText, { color: colors.primary }]}>
                      ★ {game.boardGameGeekRating.toFixed(1)}
                    </Text>
                  </Pressable>
                </>
              )}
            </View>

            {/* Ressources - boutons bien visibles */}
            <View style={styles.resourcesContainer}>
              {/* PDF Règles */}
              {game.rulesPdfUrl && (
                <Pressable
                  onPress={handleOpenPdf}
                  style={({ pressed }) => [
                    styles.resourceBtn,
                    { 
                      backgroundColor: '#dc262615',
                      borderColor: '#dc262630',
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text style={styles.resourceBtnIcon}>📖</Text>
                  <Text style={[styles.resourceBtnText, { color: '#dc2626' }]}>
                    Règles PDF
                  </Text>
                </Pressable>
              )}

              {/* Vidéos */}
              {game.rulesVideos.length > 0 && (
                <Pressable
                  onPress={() => {
                    haptics.light();
                    setShowVideosModal(true);
                  }}
                  style={({ pressed }) => [
                    styles.resourceBtn,
                    { 
                      backgroundColor: '#dc262615',
                      borderColor: '#dc262630',
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text style={styles.resourceBtnIcon}>🎬</Text>
                  <Text style={[styles.resourceBtnText, { color: '#dc2626' }]}>
                    {game.rulesVideos.length} Vidéos
                  </Text>
                </Pressable>
              )}
            </View>
          </LinearGradient>
        </BlurView>
      </View>

      {/* Modal vidéos */}
      <Modal
        visible={showVideosModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVideosModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowVideosModal(false)}
        >
          <Animated.View 
            entering={FadeInDown.duration(300)}
            style={styles.modalContainer}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={[styles.modalContent, { backgroundColor: colors.background, borderColor: colors.cardBorder }]}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    🎬 Vidéos explicatives
                  </Text>
                  <Pressable 
                    onPress={() => {
                      haptics.light();
                      setShowVideosModal(false);
                    }}
                    style={[styles.modalCloseBtn, { backgroundColor: colors.cardBackground }]}
                  >
                    <Text style={[styles.modalCloseText, { color: colors.textSecondary }]}>✕</Text>
                  </Pressable>
                </View>

                <ScrollView style={styles.videosList} showsVerticalScrollIndicator={false}>
                  {game.rulesVideos.map((video, index) => (
                    <Animated.View
                      key={video.id}
                      entering={FadeIn.duration(300).delay(index * 80)}
                    >
                      <Pressable
                        onPress={() => handleOpenVideo(video.url)}
                        style={({ pressed }) => [
                          styles.videoItem,
                          { 
                            backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                            opacity: pressed ? 0.7 : 1,
                          },
                        ]}
                      >
                        {/* Thumbnail */}
                        <View style={styles.videoThumbContainer}>
                          {video.thumbnailUrl ? (
                            <Image
                              source={{ uri: video.thumbnailUrl }}
                              style={styles.videoThumb}
                              contentFit="cover"
                            />
                          ) : (
                            <View style={[styles.videoThumbPlaceholder, { backgroundColor: colors.cardBorder }]}>
                              <Text style={styles.videoPlayIcon}>▶️</Text>
                            </View>
                          )}
                          {/* Duration badge */}
                          <View style={styles.durationBadge}>
                            <Text style={styles.durationText}>{video.duration}</Text>
                          </View>
                        </View>
                        
                        {/* Info */}
                        <View style={styles.videoInfo}>
                          <Text style={[styles.videoTitle, { color: colors.text }]} numberOfLines={2}>
                            {video.title}
                          </Text>
                          <View style={styles.videoMeta}>
                            <Text style={[styles.videoChannel, { color: colors.textSecondary }]}>
                              {video.channel}
                            </Text>
                            <View style={[
                              styles.langBadge,
                              { backgroundColor: video.language === 'fr' ? '#3b82f620' : '#f9731620' }
                            ]}>
                              <Text style={[
                                styles.langText,
                                { color: video.language === 'fr' ? '#3b82f6' : '#f97316' }
                              ]}>
                                {video.language.toUpperCase()}
                              </Text>
                            </View>
                          </View>
                        </View>
                        
                        <Text style={[styles.videoArrow, { color: colors.textTertiary }]}>→</Text>
                      </Pressable>
                    </Animated.View>
                  ))}
                </ScrollView>
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 16,
  },
  blur: {
    overflow: 'hidden',
  },
  content: {
    padding: 14,
    gap: 12,
  },
  
  // Infos essentielles - très compact
  essentialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
  },
  dot: {
    fontSize: 10,
  },
  bggText: {
    fontSize: 13,
    fontWeight: '600',
  },
  
  // Ressources - boutons côte à côte
  resourcesContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  resourceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  resourceBtnIcon: {
    fontSize: 16,
  },
  resourceBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modalContent: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    maxHeight: 480,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
  },
  
  // Videos list
  videosList: {
    padding: 16,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    gap: 12,
  },
  videoThumbContainer: {
    position: 'relative',
    width: 90,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoThumb: {
    width: '100%',
    height: '100%',
  },
  videoThumbPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayIcon: {
    fontSize: 20,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 18,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  videoChannel: {
    fontSize: 12,
  },
  langBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  langText: {
    fontSize: 10,
    fontWeight: '700',
  },
  videoArrow: {
    fontSize: 16,
  },
});