declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Google Cloud Speech-to-Text API Key
      EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY: string;
      
      // Deepseek API Key
      EXPO_PUBLIC_DEEPSEEK_API_KEY: string;
    }
  }
}

// Ensure this file is treated as a module
export {};