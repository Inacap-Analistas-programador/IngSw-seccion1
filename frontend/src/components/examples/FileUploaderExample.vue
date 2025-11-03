<template>
  <div class="space-y-8 p-6">
    <h2 class="text-2xl font-bold">Ejemplos de FileUploader</h2>
    
    <!-- Single Image Upload -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Subir una imagen</h3>
      <FileUploader
        :max-size="5 * 1024 * 1024"
        :allowed-types="['image/jpeg', 'image/png', 'image/webp']"
        @upload="onImageUpload"
        @error="onError"
      >
        Seleccionar imagen
      </FileUploader>
    </div>

    <!-- Multiple Documents -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Subir documentos (múltiples)</h3>
      <FileUploader
        ref="docUploader"
        multiple
        :max-size="10 * 1024 * 1024"
        :allowed-types="['.pdf', '.doc', '.docx', '.txt']"
        @upload="onDocumentUpload"
        @remove="onFileRemove"
        @error="onError"
      >
        Seleccionar documentos
      </FileUploader>
      
      <div class="flex space-x-2">
        <button 
          @click="startUpload"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Iniciar subida
        </button>
        <button 
          @click="clearAll"
          class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Limpiar todo
        </button>
      </div>
    </div>

    <!-- Any File Type -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Cualquier archivo</h3>
      <FileUploader
        :max-size="20 * 1024 * 1024"
        @upload="onAnyFileUpload"
        @error="onError"
      />
    </div>

    <!-- Messages -->
    <div v-if="messages.length" class="space-y-2">
      <div 
        v-for="(message, index) in messages" 
        :key="index"
        :class="[
          'p-3 rounded',
          message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        ]"
      >
        {{ message.text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FileUploader from '../shared/FileUploader.vue'

interface Message {
  type: 'success' | 'error'
  text: string
}

const docUploader = ref()
const messages = ref<Message[]>([])

const addMessage = (type: 'success' | 'error', text: string) => {
  messages.value.push({ type, text })
  setTimeout(() => {
    messages.value.shift()
  }, 5000)
}

const onImageUpload = (files: File[]) => {
  addMessage('success', `Imagen seleccionada: ${files[0].name}`)
}

const onDocumentUpload = (files: File[]) => {
  addMessage('success', `${files.length} documento(s) seleccionado(s)`)
}

const onAnyFileUpload = (files: File[]) => {
  addMessage('success', `Archivo seleccionado: ${files[0].name}`)
}

const onFileRemove = (file: File) => {
  addMessage('success', `Archivo eliminado: ${file.name}`)
}

const onError = (errors: string[]) => {
  errors.forEach(error => addMessage('error', error))
}

const startUpload = () => {
  const files = docUploader.value?.getFiles() || []
  files.forEach((file: File, index: number) => {
    setTimeout(() => {
      docUploader.value?.simulateUpload(docUploader.value.files[index])
    }, index * 500)
  })
}

const clearAll = () => {
  docUploader.value?.clearFiles()
  addMessage('success', 'Todos los archivos eliminados')
}
</script>