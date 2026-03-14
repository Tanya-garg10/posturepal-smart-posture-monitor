// Mock data for PosturePal dashboard
// This data is used for demonstration purposes and will be replaced with real API calls

export const mockUser = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
  joinDate: '2024-01-15',
  subscriptionTier: 'Premium',
};

export const mockPostureScores = [
  { time: '00:00', score: 78, status: 'Good' },
  { time: '04:00', score: 65, status: 'Fair' },
  { time: '08:00', score: 82, status: 'Good' },
  { time: '12:00', score: 71, status: 'Fair' },
  { time: '16:00', score: 85, status: 'Good' },
  { time: '20:00', score: 76, status: 'Good' },
  { time: '24:00', score: 80, status: 'Good' },
];

export const mockWeeklyData = [
  { day: 'Mon', score: 72, minutes: 120 },
  { day: 'Tue', score: 78, minutes: 135 },
  { day: 'Wed', score: 75, minutes: 128 },
  { day: 'Thu', score: 82, minutes: 145 },
  { day: 'Fri', score: 85, minutes: 155 },
  { day: 'Sat', score: 88, minutes: 165 },
  { day: 'Sun', score: 80, minutes: 140 },
];

export const mockAlerts = [
  {
    id: '1',
    type: 'Slouch',
    message: 'Slouching detected',
    timestamp: new Date(Date.now() - 5 * 60000),
    severity: 'high',
    resolved: false,
  },
  {
    id: '2',
    type: 'Neck Warning',
    message: 'Neck strain detected',
    timestamp: new Date(Date.now() - 15 * 60000),
    severity: 'medium',
    resolved: false,
  },
  {
    id: '3',
    type: 'Break Reminder',
    message: 'Time for a posture break',
    timestamp: new Date(Date.now() - 30 * 60000),
    severity: 'low',
    resolved: true,
  },
  {
    id: '4',
    type: 'Slouch',
    message: 'Poor posture detected',
    timestamp: new Date(Date.now() - 60 * 60000),
    severity: 'high',
    resolved: true,
  },
  {
    id: '5',
    type: 'Screen Distance',
    message: 'Screen too close',
    timestamp: new Date(Date.now() - 120 * 60000),
    severity: 'medium',
    resolved: true,
  },
];

export const mockRecommendations = [
  {
    id: '1',
    title: 'Neck Stretch',
    description: 'Gently tilt your head to each side, holding for 15 seconds',
    duration: '5 min',
    difficulty: 'Easy',
    category: 'Stretch',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    title: 'Shoulder Rolls',
    description: 'Perform controlled shoulder rolls to release tension',
    duration: '3 min',
    difficulty: 'Easy',
    category: 'Stretch',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    title: 'Spinal Twist',
    description: 'Seated spinal twist to improve flexibility and posture',
    duration: '7 min',
    difficulty: 'Medium',
    category: 'Exercise',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    title: 'Back Strengthening',
    description: 'Strengthen your back with targeted exercises',
    duration: '10 min',
    difficulty: 'Medium',
    category: 'Exercise',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
  },
];

export const mockAnalytics = {
  totalMinitored: 847,
  averageScore: 79,
  bestStreak: 5,
  currentStreak: 2,
  improvementWeek: 12,
  improvementMonth: 28,
  posture: {
    good: 68,
    fair: 22,
    poor: 10,
  },
};

export const mockDailyInsights = [
  {
    title: 'Peak Performance',
    value: '85',
    description: 'Best posture score today',
    icon: 'trending-up',
  },
  {
    title: 'Active Time',
    value: '4h 23m',
    description: 'Time spent in good posture',
    icon: 'clock',
  },
  {
    title: 'Alerts',
    value: '3',
    description: 'Alerts triggered today',
    icon: 'alert-circle',
  },
  {
    title: 'Improvement',
    value: '+5%',
    description: 'vs yesterday',
    icon: 'arrow-up',
  },
];

export const mockHeatmapData = [
  { hour: '0', Mon: 70, Tue: 72, Wed: 71, Thu: 75, Fri: 78, Sat: 80, Sun: 76 },
  { hour: '1', Mon: 65, Tue: 68, Wed: 67, Thu: 70, Fri: 72, Sat: 75, Sun: 72 },
  { hour: '2', Mon: 60, Tue: 62, Wed: 61, Thu: 65, Fri: 68, Sat: 70, Sun: 68 },
  { hour: '3', Mon: 58, Tue: 60, Wed: 59, Thu: 62, Fri: 65, Sat: 68, Sun: 65 },
  { hour: '4', Mon: 62, Tue: 65, Wed: 64, Thu: 68, Fri: 70, Sat: 72, Sun: 70 },
  { hour: '5', Mon: 72, Tue: 75, Wed: 74, Thu: 78, Fri: 80, Sat: 82, Sun: 78 },
  { hour: '6', Mon: 78, Tue: 80, Wed: 79, Thu: 82, Fri: 85, Sat: 87, Sun: 83 },
  { hour: '7', Mon: 82, Tue: 84, Wed: 83, Thu: 86, Fri: 88, Sat: 90, Sun: 86 },
  { hour: '8', Mon: 85, Tue: 87, Wed: 86, Thu: 89, Fri: 91, Sat: 92, Sun: 89 },
  { hour: '9', Mon: 87, Tue: 89, Wed: 88, Thu: 91, Fri: 93, Sat: 94, Sun: 91 },
  { hour: '10', Mon: 86, Tue: 88, Wed: 87, Thu: 90, Fri: 92, Sat: 93, Sun: 90 },
  { hour: '11', Mon: 84, Tue: 86, Wed: 85, Thu: 88, Fri: 90, Sat: 91, Sun: 88 },
  { hour: '12', Mon: 80, Tue: 82, Wed: 81, Thu: 84, Fri: 86, Sat: 87, Sun: 84 },
  { hour: '13', Mon: 75, Tue: 77, Wed: 76, Thu: 79, Fri: 81, Sat: 82, Sun: 79 },
  { hour: '14', Mon: 72, Tue: 74, Wed: 73, Thu: 76, Fri: 78, Sat: 79, Sun: 76 },
  { hour: '15', Mon: 70, Tue: 72, Wed: 71, Thu: 74, Fri: 76, Sat: 77, Sun: 74 },
  { hour: '16', Mon: 73, Tue: 75, Wed: 74, Thu: 77, Fri: 79, Sat: 80, Sun: 77 },
  { hour: '17', Mon: 76, Tue: 78, Wed: 77, Thu: 80, Fri: 82, Sat: 83, Sun: 80 },
  { hour: '18', Mon: 79, Tue: 81, Wed: 80, Thu: 83, Fri: 85, Sat: 86, Sun: 83 },
  { hour: '19', Mon: 77, Tue: 79, Wed: 78, Thu: 81, Fri: 83, Sat: 84, Sun: 81 },
  { hour: '20', Mon: 74, Tue: 76, Wed: 75, Thu: 78, Fri: 80, Sat: 81, Sun: 78 },
  { hour: '21', Mon: 71, Tue: 73, Wed: 72, Thu: 75, Fri: 77, Sat: 78, Sun: 75 },
  { hour: '22', Mon: 68, Tue: 70, Wed: 69, Thu: 72, Fri: 74, Sat: 75, Sun: 72 },
  { hour: '23', Mon: 65, Tue: 67, Wed: 66, Thu: 69, Fri: 71, Sat: 72, Sun: 69 },
];

export const mockLiveMetrics = {
  neckAngle: 12,
  spineAlignment: 8,
  screenDistance: 55,
  sessionDuration: 125,
  currentScore: 82,
  status: 'Good',
};

export const mockDetectedIssues = [
  {
    issue: 'Slight slouch detected',
    fix: 'Straighten your back and engage your core',
    severity: 'low',
  },
  {
    issue: 'Screen too close',
    fix: 'Move screen 20 inches away from your face',
    severity: 'medium',
  },
  {
    issue: 'Neck strain risk',
    fix: 'Adjust monitor height to eye level',
    severity: 'high',
  },
];

export const mockGoals = [
  {
    id: '1',
    title: '80+ Score Daily',
    progress: 75,
    deadline: '2024-04-01',
    status: 'in-progress',
  },
  {
    id: '2',
    title: '5-Day Streak',
    progress: 40,
    deadline: '2024-03-31',
    status: 'in-progress',
  },
  {
    id: '3',
    title: 'No Slouch Days',
    progress: 100,
    deadline: '2024-03-20',
    status: 'completed',
  },
];

// Gamification - Streaks, Badges, Achievements
export const mockUserStreaks = {
  current: 12,
  longest: 28,
  weeklyGoal: 7,
};

export const mockBadges = [
  {
    id: 'perfect-week',
    name: 'Perfect Week',
    description: '7 consecutive days of 80+ score',
    earned: true,
    earnedDate: '2024-03-10',
    icon: 'award',
  },
  {
    id: 'stretch-champion',
    name: 'Stretch Champion',
    description: 'Completed 50 stretch exercises',
    earned: true,
    earnedDate: '2024-02-28',
    icon: 'zap',
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Good posture before 8 AM for 5 days',
    earned: true,
    earnedDate: '2024-03-05',
    icon: 'sunrise',
  },
  {
    id: 'no-slouch',
    name: 'No Slouch',
    description: '0 slouch detections in a day',
    earned: false,
    progress: 75,
    icon: 'shield',
  },
  {
    id: 'marathon-sitter',
    name: 'Marathon Sitter',
    description: '30+ hours of monitoring',
    earned: false,
    progress: 42,
    icon: 'activity',
  },
];

export const mockAchievements = [
  {
    id: 'streak-3',
    title: '3-Day Streak',
    description: 'Maintain 3 consecutive days of good posture',
    icon: 'flame',
    tier: 'bronze',
  },
  {
    id: 'streak-7',
    title: '7-Day Streak',
    description: 'Maintain 7 consecutive days of good posture',
    icon: 'flame',
    tier: 'silver',
  },
  {
    id: 'streak-30',
    title: '30-Day Streak',
    description: 'Maintain 30 consecutive days of good posture',
    icon: 'flame',
    tier: 'gold',
  },
];

// Pose Skeleton Data (for visualization)
export const mockPoseSkeleton = {
  nose: { x: 320, y: 150, confidence: 0.99 },
  leftEye: { x: 305, y: 135, confidence: 0.98 },
  rightEye: { x: 335, y: 135, confidence: 0.98 },
  leftEar: { x: 290, y: 140, confidence: 0.97 },
  rightEar: { x: 350, y: 140, confidence: 0.97 },
  leftShoulder: { x: 250, y: 220, confidence: 0.96 },
  rightShoulder: { x: 390, y: 220, confidence: 0.96 },
  leftElbow: { x: 200, y: 280, confidence: 0.95 },
  rightElbow: { x: 440, y: 280, confidence: 0.95 },
  leftWrist: { x: 170, y: 320, confidence: 0.94 },
  rightWrist: { x: 470, y: 320, confidence: 0.94 },
  leftHip: { x: 280, y: 360, confidence: 0.95 },
  rightHip: { x: 360, y: 360, confidence: 0.95 },
  leftKnee: { x: 270, y: 430, confidence: 0.94 },
  rightKnee: { x: 370, y: 430, confidence: 0.94 },
  leftAnkle: { x: 260, y: 480, confidence: 0.93 },
  rightAnkle: { x: 380, y: 480, confidence: 0.93 },
};

// Smart Break Reminder
export const mockBreakReminder = {
  enabled: true,
  sitDuration: 50,
  breakDuration: 2,
  nextReminderAt: new Date(Date.now() + 10 * 60000),
  reminderFrequency: 45,
};

// AI Health Coach Suggestions
export const mockCoachSuggestions = [
  {
    id: 'suggestion-1',
    type: 'posture',
    priority: 'high',
    message: 'Straighten your back',
    details: 'Your spine is not aligned properly. Sit up straight and engage your core.',
    actionable: true,
  },
  {
    id: 'suggestion-2',
    type: 'screen',
    priority: 'medium',
    message: 'Keep your screen at eye level',
    details: 'Your screen position is causing neck strain. Adjust it to be at eye level.',
    actionable: true,
  },
  {
    id: 'suggestion-3',
    type: 'shoulders',
    priority: 'medium',
    message: 'Relax your shoulders',
    details: 'Your shoulders are tensed. Take a deep breath and relax them.',
    actionable: true,
  },
  {
    id: 'suggestion-4',
    type: 'break',
    priority: 'low',
    message: 'Consider taking a break',
    details: 'You\'ve been sitting for a while. A quick stretch break can help.',
    actionable: true,
  },
];

// Desk Setup Recommendation
export const mockDeskSetup = {
  monitorDistance: {
    current: 45,
    recommended: 55,
    unit: 'cm',
    status: 'needs-adjustment',
  },
  monitorHeight: {
    current: 15,
    recommended: 25,
    unit: 'cm from desk',
    status: 'needs-adjustment',
  },
  chairHeight: {
    current: 40,
    recommended: 42,
    unit: 'cm',
    status: 'good',
  },
  keyboardHeight: {
    current: 72,
    recommended: 75,
    unit: 'cm',
    status: 'optimal',
  },
  footSupport: {
    status: 'missing',
    recommendation: 'Use a footrest to keep feet flat',
  },
};

// Stretch Exercise Suggestions
export const mockStretchExercises = [
  {
    id: 'stretch-1',
    name: 'Neck Flexion & Extension',
    duration: 30,
    reps: 8,
    instructions: 'Lower your chin to your chest, then tilt your head back slowly.',
    targetArea: 'neck',
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
  },
  {
    id: 'stretch-2',
    name: 'Shoulder Shrug & Roll',
    duration: 30,
    reps: 10,
    instructions: 'Raise shoulders to ears, then rotate them backward in circles.',
    targetArea: 'shoulders',
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
  },
  {
    id: 'stretch-3',
    name: 'Spinal Twist',
    duration: 45,
    reps: 8,
    instructions: 'Cross one leg over the other while seated, then twist gently.',
    targetArea: 'back',
    difficulty: 'medium',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
  },
  {
    id: 'stretch-4',
    name: 'Chest Opener',
    duration: 30,
    reps: 10,
    instructions: 'Interlace fingers behind your back and gently pull arms down.',
    targetArea: 'chest',
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
  },
];

// Smart Notifications History
export const mockNotifications = [
  {
    id: 'notif-1',
    type: 'slouch',
    title: 'Slouching Detected',
    message: 'Your posture has declined. Straighten your back.',
    timestamp: new Date(Date.now() - 5 * 60000),
    read: false,
    actionable: true,
  },
  {
    id: 'notif-2',
    type: 'break',
    title: 'Break Time Reminder',
    message: 'You\'ve been sitting for 45 minutes. Time for a stretch!',
    timestamp: new Date(Date.now() - 15 * 60000),
    read: true,
    actionable: true,
  },
  {
    id: 'notif-3',
    type: 'neck-bend',
    title: 'Neck Strain Risk',
    message: 'Your neck is bent too far forward. Adjust screen position.',
    timestamp: new Date(Date.now() - 30 * 60000),
    read: true,
    actionable: true,
  },
  {
    id: 'notif-4',
    type: 'achievement',
    title: 'Achievement Unlocked',
    message: 'You\'ve reached a 7-day perfect posture streak!',
    timestamp: new Date(Date.now() - 120 * 60000),
    read: true,
    actionable: false,
  },
];

// Corporate/School Mode Data
export const mockCorporateMode = {
  organizationName: 'Tech Corp',
  organizationType: 'corporate',
  admin: true,
  employees: 150,
  departments: [
    { name: 'Engineering', employees: 45, avgScore: 82 },
    { name: 'Design', employees: 20, avgScore: 78 },
    { name: 'Sales', employees: 35, avgScore: 75 },
    { name: 'HR', employees: 15, avgScore: 80 },
    { name: 'Operations', employees: 35, avgScore: 73 },
  ],
  dashboardMetrics: {
    orgAvgScore: 77,
    healthScore: 78,
    complianceRate: 85,
    activeUsers: 132,
    wellnessIndex: 8.2,
  },
};
