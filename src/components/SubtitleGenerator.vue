<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Upload Section -->
      <div class="mb-6">
        <h2 class="text-2xl font-semibold mb-4 text-black">Upload MKV Video</h2>
        <div 
          class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
          @dragover.prevent
          @drop.prevent="handleFileDrop"
        >
          <input
            type="file"
            ref="fileInput"
            accept=".mkv"
            class="hidden"
            @change="handleFileUpload"
          />
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            @click="$refs.fileInput.click()"
          >
            Select MKV File
          </button>
          <p class="mt-2 text-gray-600">or drag and drop your file here</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="subtitleStore.isLoading" class="text-center py-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-2 text-gray-600">Processing...</p>
      </div>

      <!-- Error State -->
      <div v-if="subtitleStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ subtitleStore.error }}
      </div>

      <!-- Subtitles Section -->
      <div v-if="subtitles" class="mt-8">
        <div class="grid grid-cols-2 gap-6">
          <!-- Original Subtitles -->
          <div>
            <h3 class="text-xl font-semibold mb-3 text-black">Original Subtitles</h3>
            <div class="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
              <pre class="whitespace-pre-wrap text-black">{{ subtitles }}</pre>
            </div>
          </div>

          <!-- Translated Subtitles -->
          <div v-if="translatedSubtitles">
            <h3 class="text-xl font-semibold mb-3 text-black">Translated Subtitles</h3>
            <div class="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
              <pre class="whitespace-pre-wrap text-black">{{ translatedSubtitles }}</pre>
            </div>
          </div>
        </div>

        <!-- Translation Options -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold mb-3 text-black">Translation Options</h3>
          <div class="flex gap-4">
            <select
              v-model="targetLanguage"
              class="border rounded-lg px-3 py-2 text-black"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="id">Indonesian</option>
            </select>
            <select
              v-model="aiModel"
              class="border rounded-lg px-3 py-2 text-black"
            >
              <option value="openai">OpenAI</option>
              <option value="claude">Claude</option>
            </select>
            <button
              @click="translateSubtitles"
              class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Translate
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="translatedSubtitles" class="mt-6 flex gap-4">
          <button
            @click="downloadSubtitles"
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Download Subtitles
          </button>
          <button
            @click="generateNewVideo"
            class="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
          >
            Generate Video with New Subtitles
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSubtitleStore } from '@/stores/subtitle'

const subtitles = ref<string>('')
const translatedSubtitles = ref<string>('')
const targetLanguage = ref('en')
const aiModel = ref('openai')
const fileInput = ref<HTMLInputElement | null>(null)
const subtitleStore = useSubtitleStore()

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    await processFile(file)
  }
}

const handleFileDrop = async (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file && file.name.endsWith('.mkv')) {
    await processFile(file)
  }
}

const processFile = async (file: File) => {
  try {
    const extractedSubtitles = await subtitleStore.extractSubtitles(file)
    subtitles.value = extractedSubtitles
    translatedSubtitles.value = ''
  } catch (error) {
    console.error('Error extracting subtitles:', error)
  }
}

const translateSubtitles = async () => {
  try {
    const translated = await subtitleStore.translateSubtitles(
      subtitles.value,
      targetLanguage.value,
      aiModel.value
    )
    translatedSubtitles.value = translated
  } catch (error) {
    console.error('Error translating subtitles:', error)
  }
}

const downloadSubtitles = () => {
  const blob = new Blob([translatedSubtitles.value], { type: 'text/srt' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `translated_subtitles_${targetLanguage.value}.srt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const generateNewVideo = async () => {
  try {
    await subtitleStore.generateVideoWithSubtitles(translatedSubtitles.value)
  } catch (error) {
    console.error('Error generating video:', error)
  }
}
</script>

<style scoped>
.subtitle-generator {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.upload-section,
.subtitle-section {
  margin-bottom: 20px;
}

.subtitle-preview {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
}

.translation-options {
  margin: 20px 0;
}

.action-buttons {
  margin-top: 20px;
}

button {
  margin-right: 10px;
}
</style>