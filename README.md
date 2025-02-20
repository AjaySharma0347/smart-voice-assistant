# 🎙️ Voice Notes Pro

<div align="center">

![Voice Notes Pro](https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=800&h=400)

[![Made with Expo](https://img.shields.io/badge/Made%20with-Expo-black.svg?style=flat-square&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=flat-square&logo=google-cloud&logoColor=white)](https://cloud.google.com/)
[![Deepseek AI](https://img.shields.io/badge/Deepseek-AI-FF6B6B?style=flat-square&logo=openai&logoColor=white)](https://deepseek.com/)

</div>

<p align="center">
  <strong>Transform your voice into actionable tasks, meetings, and notes with AI-powered transcription</strong>
</p>

## 🚀 Getting Started

### Prerequisites

1. Node.js 18 or higher
2. Expo CLI
3. Google Cloud Account
4. Deepseek API Account

### Setting up Google Cloud Speech-to-Text API

1. Create a Google Cloud Project
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Click "New Project" and follow the setup wizard

2. Enable Speech-to-Text API
   - In your project, go to "APIs & Services" > "Library"
   - Search for "Cloud Speech-to-Text API"
   - Click "Enable"

3. Create API Credentials
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

### Setting up Deepseek AI

1. Create a Deepseek Account
   - Visit [Deepseek](https://deepseek.com)
   - Sign up for an account

2. Get API Key
   - Navigate to your account settings
   - Generate a new API key
   - Copy the API key

### Environment Setup

1. Create a `.env` file in your project root
2. Add your API keys:
   ```
   EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here
   EXPO_PUBLIC_DEEPSEEK_API_KEY=your_deepseek_api_key_here
   ```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npx expo start
   ```

## ✨ Features

<div align="center">

| 🎤 Voice Recording | 🤖 AI Processing | 📝 Smart Actions |
|-------------------|------------------|------------------|
| High-quality audio capture | Real-time transcription | Task extraction |
| Noise reduction | Context understanding | Meeting scheduling |
| Multi-platform support | Natural language processing | Note organization |

</div>

## 🚀 Key Capabilities

### 🎯 Intelligent Task Extraction
```typescript
// Automatically identifies and categorizes tasks
{
  type: "task",
  title: "Review project proposal",
  priority: "high",
  tags: ["project", "deadline"]
}
```

### 📅 Smart Meeting Detection
```typescript
// Seamlessly creates calendar events
{
  type: "meeting",
  title: "Team Sync",
  date: "2024-02-20T10:00:00Z",
  attendees: ["team"]
}
```

### 📝 Dynamic Note Taking
```typescript
// Organizes information effectively
{
  type: "note",
  title: "Product Ideas",
  tags: ["innovation", "brainstorm"]
}
```

## 🎨 Beautiful UI Components

<div align="center">

| Component | Description |
|-----------|-------------|
| 🔴 Voice Recorder | Animated recording interface with visual feedback |
| 📊 Action Summary | Clean, organized display of extracted information |
| ⚙️ Action Editor | Intuitive editing of detected actions |
| 🔄 Processing Indicator | Smooth, animated status updates |

</div>

## 🛠️ Technical Stack

- **Frontend Framework**: React Native with Expo
- **State Management**: React Hooks
- **Animation**: React Native Reanimated
- **Audio Processing**: Expo AV
- **Speech Recognition**: Google Cloud Speech-to-Text API
- **AI Processing**: Deepseek API
- **Date Handling**: date-fns
- **Type Safety**: TypeScript
- **Navigation**: Expo Router

## 📱 Platform Support

- ✅ iOS
- ✅ Android
- ✅ Web (Progressive Web App)

## 🔥 Performance Features

- ⚡ Optimized audio processing
- 🔄 Efficient state updates
- 📦 Minimal bundle size
- 🎨 Smooth animations
- 🔒 Secure data handling

## 🎯 Core Functionalities

1. **Voice Recording**
   - High-quality audio capture
   - Real-time feedback
   - Background noise reduction

2. **Speech Recognition & AI Processing**
   - Google Cloud Speech-to-Text integration
   - Deepseek AI for context analysis
   - Smart action extraction
   - Multi-language support

3. **Action Management**
   - Task organization
   - Meeting scheduling
   - Note categorization

4. **Data Export**
   - Calendar integration
   - Share functionality
   - Cross-platform sync

## 🎮 Usage Example

```typescript
// Start recording with one tap
<VoiceRecorder
  onTranscriptionResult={handleTranscription}
  onRecordingStart={handleStart}
  onRecordingEnd={handleEnd}
  onError={handleError}
/>

// Process and organize actions
const actions = await extractActionsFromText(transcription);
```

## 🔐 Security Features

- 🔒 Secure audio processing
- 🔑 API key protection
- 🛡️ Data encryption
- 📱 Local storage security

## 🎨 Design Philosophy

- **Minimalist**: Clean, focused interface
- **Intuitive**: Natural user interactions
- **Responsive**: Smooth animations
- **Accessible**: Universal design principles

## 📈 Future Roadmap

- [ ] Multi-language support
- [ ] Advanced AI features
- [ ] Team collaboration
- [ ] Cloud sync
- [ ] Custom actions

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more information.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">

Made with ❤️ by Ajay Sharma

[Website](https://example.com) • [Documentation](https://example.com/docs) • [Support](https://example.com/support)

</div>
