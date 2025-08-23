// src/screens/ProgressScreen.js - Progress tracking and analytics
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { THEME, ZONE_COLORS, ZONE_EMOJIS } from '../styles/colors';
import { DataManager } from '../utils/dataManager';

const { width: screenWidth } = Dimensions.get('window');

const ProgressScreen = ({ 
  userData, 
  onExportData, 
  accessibilityMode = false 
}) => {
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'weekly', 'tools'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [userData]);

  const loadAnalytics = async () => {
    try {
      const analyticsData = await DataManager.getAnalytics(userData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStreakMessage = (streakDays) => {
    if (streakDays === 0) return "Ready to start your journey? 🌟";
    if (streakDays === 1) return "Great start! One day down! 🎯";
    if (streakDays < 7) return `Amazing! ${streakDays} days in a row! 🔥`;
    if (streakDays < 30) return `Incredible streak! ${streakDays} days! 🏆`;
    return `Phenomenal! ${streakDays} days of self-care! 🌈`;
  };

  const getZoneChartData = () => {
    if (!analytics?.zoneStats) return [];
    
    return Object.entries(analytics.zoneStats).map(([zone, count]) => ({
      name: zone.charAt(0).toUpperCase() + zone.slice(1),
      population: count,
      color: ZONE_COLORS[zone] || '#cccccc',
      legendFontColor: THEME.text.primary,
      legendFontSize: 12
    }));
  };

  const getWeeklyChartData = () => {
    if (!analytics?.weeklyData) return { labels: [], datasets: [] };
    
    return {
      labels: analytics.weeklyData.map(d => d.shortDate),
      datasets: [{
        data: analytics.weeklyData.map(d => d.count || 0),
        color: (opacity = 1) => `rgba(77, 182, 172, ${opacity})`,
        strokeWidth: 2
      }]
    };
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    backgroundGradientFromOpacity: 1,
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(77, 182, 172, ${opacity})`,
    labelColor: (opacity = 1) => THEME.text.primary,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: accessibilityMode ? 14 : 12
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color = THEME.semantic.calm }) => (
    <View style={[styles.statCard, accessibilityMode && styles.highContrastCard]}>
      <View style={styles.statHeader}>
        <Text style={styles.statIcon}>{icon}</Text>
        <View style={styles.statContent}>
          <Text style={[styles.statValue, { color }, accessibilityMode && styles.highContrastText]}>
            {value}
          </Text>
          <Text style={[styles.statTitle, accessibilityMode && styles.highContrastText]}>
            {title}
          </Text>
        </View>
      </View>
      {subtitle && (
        <Text style={[styles.statSubtitle, accessibilityMode && styles.highContrastSubtitle]}>
          {subtitle}
        </Text>
      )}
    </View>
  );

  const TabButton = ({ title, isActive, onPress, icon }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTab]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ selected: isActive }}
    >
      <Text style={styles.tabIcon}>{icon}</Text>
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const OverviewTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.streakSection}>
        <Text style={styles.streakEmoji}>🔥</Text>
        <Text style={[styles.streakNumber, accessibilityMode && styles.highContrastText]}>
          {analytics?.streakDays || 0}
        </Text>
        <Text style={[styles.streakLabel, accessibilityMode && styles.highContrastText]}>
          Day Streak
        </Text>
        <Text style={[styles.streakMessage, accessibilityMode && styles.highContrastSubtitle]}>
          {getStreakMessage(analytics?.streakDays || 0)}
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Check-ins"
          value={analytics?.totalCheckins || 0}
          subtitle="Total times you've used your compass"
          icon="🧭"
          color={THEME.semantic.calm}
        />
        <StatCard
          title="Daily Average"
          value={analytics?.averageDaily?.toFixed(1) || '0.0'}
          subtitle="Check-ins per day"
          icon="📊"
          color={THEME.semantic.progress}
        />
      </View>

      {analytics?.zoneStats && Object.keys(analytics.zoneStats).length > 0 && (
        <View style={[styles.chartSection, accessibilityMode && styles.highContrastContainer]}>
          <Text style={[styles.sectionTitle, accessibilityMode && styles.highContrastText]}>
            Your Zone Journey 🎯
          </Text>
          <Text style={[styles.sectionSubtitle, accessibilityMode && styles.highContrastSubtitle]}>
            See which zones you visit most often
          </Text>
          <PieChart
            data={getZoneChartData()}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute={false}
            hasLegend={true}
          />
        </View>
      )}

      <View style={[styles.insightsSection, accessibilityMode && styles.highContrastContainer]}>
        <Text style={[styles.sectionTitle, accessibilityMode && styles.highContrastText]}>
          Your Compass Insights 💡
        </Text>
        <View style={styles.insightCard}>
          <Text style={styles.insightEmoji}>🌟</Text>
          <Text style={[styles.insightText, accessibilityMode && styles.highContrastText]}>
            {userData.checkins?.length > 0
              ? `You're building great self-awareness habits! Your most common zone is ${
                  Object.entries(analytics?.zoneStats || {})
                    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'green'
                } zone.`
              : "Welcome to your emotional journey! Start by checking in with your zones to track your progress."
            }
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const WeeklyTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={[styles.chartSection, accessibilityMode && styles.highContrastContainer]}>
        <Text style={[styles.sectionTitle, accessibilityMode && styles.highContrastText]}>
          Weekly Progress 📈
        </Text>
        <Text style={[styles.sectionSubtitle, accessibilityMode && styles.highContrastSubtitle]}>
          Your check-ins over the past week
        </Text>
        
        {analytics?.weeklyData && analytics.weeklyData.some(d => d.count > 0) ? (
          <LineChart
            data={getWeeklyChartData()}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withDots={true}
            withInnerLines={false}
            withOuterLines={true}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataEmoji}>📊</Text>
            <Text style={[styles.noDataText, accessibilityMode && styles.highContrastText]}>
              Start checking in daily to see your progress graph!
            </Text>
          </View>
        )}
      </View>

      <View style={[styles.weeklyDetails, accessibilityMode && styles.highContrastContainer]}>
        <Text style={[styles.sectionTitle, accessibilityMode && styles.highContrastText]}>
          Daily Details 📅
        </Text>
        {analytics?.weeklyData?.map((day, index) => (
          <View key={index} style={styles.dayRow}>
            <Text style={styles.dayName}>{day.shortDate}</Text>
            <View style={styles.dayInfo}>
              <Text style={[styles.dayCount, accessibilityMode && styles.highContrastText]}>
                {day.count} check-ins
              </Text>
              {day.zones.length > 0 && (
                <View style={styles.dayZones}>
                  {[...new Set(day.zones)].map(zone => (
                    <Text key={zone} style={styles.zoneEmoji}>
                      {ZONE_EMOJIS[zone]}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const ToolsTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={[styles.toolsSection, accessibilityMode && styles.highContrastContainer]}>
        <Text style={[styles.sectionTitle, accessibilityMode && styles.highContrastText]}>
          Your Favorite Tools 🛠️
        </Text>
        <Text style={[styles.sectionSubtitle, accessibilityMode && styles.highContrastSubtitle]}>
          The coping strategies you use most
        </Text>
        
        {analytics?.topTools && analytics.topTools.length > 0 ? (
          analytics.topTools.map(([toolName, count], index) => (
            <View key={toolName} style={styles.toolRow}>
              <View style={styles.toolRank}>
                <Text style={styles.toolRankText}>#{index + 1}</Text>
              </View>
              <View style={styles.toolInfo}>
                <Text style={[styles.toolName, accessibilityMode && styles.highContrastText]}>
                  {toolName}
                </Text>
                <Text style={[styles.toolCount, accessibilityMode && styles.highContrastSubtitle]}>
                  Used {count} times
                </Text>
              </View>
              <View style={styles.toolProgress}>
                <View 
                  style={[
                    styles.toolProgressBar, 
                    { width: `${Math.min(100, (count / Math.max(...analytics.topTools.map(t => t[1]))) * 100)}%` }
                  ]} 
                />
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataEmoji}>🛠️</Text>
            <Text style={[styles.noDataText, accessibilityMode && styles.highContrastText]}>
              Start using coping tools to see your favorites here!
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.exportButton, accessibilityMode && styles.highContrastButton]}
        onPress={() => {
          Alert.alert(
            'Share Progress 📊',
            'Would you like to create a report to share with a parent, teacher, or counselor?',
            [
              { text: 'Not now', style: 'cancel' },
              { text: 'Create Report', onPress: onExportData }
            ]
          );
        }}
        accessibilityRole="button"
        accessibilityLabel="Export progress data"
      >
        <Text style={styles.exportButtonText}>📤 Share My Progress</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>🧭</Text>
        <Text style={styles.loadingText}>Loading your progress...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, accessibilityMode && styles.highContrastContainer]}>
      <View style={styles.tabBar}>
        <TabButton
          title="Overview"
          icon="📊"
          isActive={activeTab === 'overview'}
          onPress={() => setActiveTab('overview')}
        />
        <TabButton
          title="Weekly"
          icon="📅"
          isActive={activeTab === 'weekly'}
          onPress={() => setActiveTab('weekly')}
        />
        <TabButton
          title="Tools"
          icon="🛠️"
          isActive={activeTab === 'tools'}
          onPress={() => setActiveTab('tools')}
        />
      </View>

      <View style={styles.tabContent}>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'weekly' && <WeeklyTab />}
        {activeTab === 'tools' && <ToolsTab />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.primary.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.primary.background,
  },
  loadingEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: THEME.text.secondary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: THEME.primary.white,
    paddingHorizontal: 20,
    paddingTop: 10,
    shadowColor: THEME.primary.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: THEME.semantic.calm,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.text.secondary,
  },
  activeTabText: {
    color: THEME.semantic.calm,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  streakSection: {
    backgroundColor: THEME.primary.white,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: THEME.primary.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  streakEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: THEME.semantic.encouraging,
    marginBottom: 5,
  },
  streakLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 10,
  },
  streakMessage: {
    fontSize: 14,
    color: THEME.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: THEME.primary.white,
    borderRadius: 15,
    padding: 15,
    flex: 0.48,
    shadowColor: THEME.primary.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.text.primary,
  },
  statSubtitle: {
    fontSize: 10,
    color: THEME.text.secondary,
    lineHeight: 14,
  },
  chartSection: {
    backgroundColor: THEME.primary.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: THEME.primary.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: 5,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: THEME.text.secondary,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 18,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDataEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  noDataText: {
    fontSize: 16,
    color: THEME.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  insightsSection: {
    backgroundColor: THEME.primary.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: THEME.primary.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: THEME.semantic.calm,
  },
  insightEmoji: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: THEME.text.primary,
    lineHeight: 20,
  },
  weeklyDetails: {
    backgroundColor: THEME.primary.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: THEME.primary.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dayName: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text.primary,
    width: 50,
  },
  dayInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayCount: {
    fontSize: 13,
    color: THEME.text.secondary,
  },
  dayZones: {
    flexDirection: 'row',
  },
  zoneEmoji: {
    fontSize: 16,
    marginLeft: 4,
  },
  toolsSection: {
    backgroundColor: THEME.primary.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: THEME.primary.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  toolRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: THEME.semantic.calm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  toolRankText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  toolInfo: {
    flex: 1,
    marginRight: 10,
  },
  toolName: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 2,
  },
  toolCount: {
    fontSize: 12,
    color: THEME.text.secondary,
  },
  toolProgress: {
    width: 60,
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
  },
  toolProgressBar: {
    height: '100%',
    backgroundColor: THEME.semantic.calm,
    borderRadius: 3,
  },
  exportButton: {
    backgroundColor: THEME.semantic.calm,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  // High contrast styles
  highContrastContainer: {
    backgroundColor: THEME.accessibility.highContrast.background,
    borderWidth: 2,
    borderColor: THEME.accessibility.highContrast.primary,
  },
  highContrastCard: {
    backgroundColor: THEME.accessibility.highContrast.background,
    borderColor: THEME.accessibility.highContrast.primary,
  },
  highContrastText: {
    color: THEME.accessibility.highContrast.text,
  },
  highContrastSubtitle: {
    color: THEME.accessibility.highContrast.secondary,
  },
  highContrastButton: {
    backgroundColor: THEME.accessibility.highContrast.primary,
    borderWidth: 2,
    borderColor: THEME.accessibility.highContrast.text,
  },
});

export default ProgressScreen;