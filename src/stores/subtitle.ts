import { defineStore } from 'pinia'
import OpenAI from 'openai'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000'

export const useSubtitleStore = defineStore('subtitle', {
  state: () => ({
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async extractSubtitles(file: File): Promise<string> {
      this.isLoading = true
      this.error = null
      
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await axios.post(`${API_BASE_URL}/api/extract-subtitles`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        })
        return response.data.subtitles
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Failed to extract subtitles'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async translateSubtitles(
      subtitles: string,
      targetLanguage: string,
      aiModel: string
    ): Promise<string> {
      this.isLoading = true
      this.error = null
      
      try {
        if (aiModel === 'openai') {
          return await this.translateWithOpenAI(subtitles, targetLanguage)
        } else {
          return await this.translateWithMoonshot(subtitles, targetLanguage)
        }
      } catch (error) {
        console.error('Error translating subtitles:', error)
        this.error = 'Failed to translate subtitles'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async translateWithOpenAI(subtitles: string, targetLanguage: string): Promise<string> {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      })

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a professional translator. Translate the following subtitles to ${targetLanguage}. Maintain the original timing and formatting.`
          },
          {
            role: "user",
            content: subtitles
          }
        ]
      })

      return response.choices[0].message.content || ''
    },

    async translateWithMoonshot(subtitles: string, targetLanguage: string): Promise<string> {
      // Instead of using OpenAI client, we'll use axios directly for Moonshot API
      try {
        const response = await axios.post(
          'https://api.moonshot.ai/v1/chat/completions',
          {
            model: "moonshot-v1-8k",
            messages: [
              {
                role: "system",
                content: `You are a professional translator. Translate the following subtitles to ${targetLanguage}. Maintain the original timing and formatting. Keep all numbers, timestamps and formatting intact.`
              },
              {
                role: "user",
                content: subtitles
              }
            ],
            temperature: 0.3
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_MOONSHOT_API_KEY}`
            }
          }
        )

        return response.data.choices[0].message.content || ''
      } catch (error) {
        console.error('Moonshot API error:', error)
        throw new Error('Failed to translate with Moonshot API')
      }
    },

    async generateVideoWithSubtitles(subtitles: string): Promise<void> {
      this.isLoading = true
      this.error = null
      
      try {
        const formData = new FormData()
        formData.append('subtitles', subtitles)
        
        await axios.post('/api/generate-video', formData, {
          responseType: 'blob'
        })
      } catch (error) {
        this.error = 'Failed to generate video'
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})