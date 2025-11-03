<template>
  <div class="file-uploader space-y-4">
    <!-- Drop Zone -->
    <div 
      @drop="onDrop" 
      @dragover.prevent 
      @dragenter.prevent
      :class="[
        'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      ]"
    >
      <input 
        ref="fileInput"
        type="file" 
        :accept="accept"
        :multiple="multiple"
        @change="onFileChange" 
        class="hidden"
      />
      <div class="space-y-2">
        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div>
          <button 
            type="button" 
            @click="$refs.fileInput.click()"
            class="text-blue-600 hover:text-blue-500 font-medium"
          >
            <slot>Seleccionar archivo{{ multiple ? 's' : '' }}</slot>
          </button>
          <p class="text-gray-500">o arrastra aquí</p>
        </div>
        <p class="text-xs text-gray-400">
          {{ acceptText }} • Máximo {{ formatFileSize(maxSize) }}
        </p>
      </div>
    </div>

    <!-- Validation Errors -->
    <div v-if="errors.length" class="space-y-1">
      <p v-for="error in errors" :key="error" class="text-sm text-red-600">
        {{ error }}
      </p>
    </div>

    <!-- File List -->
    <div v-if="files.length" class="space-y-3">
      <div 
        v-for="(file, index) in files" 
        :key="file.id"
        class="flex items-center space-x-3 p-3 border rounded-lg"
      >
        <!-- Preview -->
        <div class="flex-shrink-0">
          <img 
            v-if="file.preview" 
            :src="file.preview" 
            :alt="file.name"
            class="h-12 w-12 object-cover rounded"
          />
          <div v-else class="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
            <svg class="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <!-- File Info -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
          <p class="text-sm text-gray-500">{{ formatFileSize(file.size) }}</p>
          
          <!-- Progress Bar -->
          <div v-if="file.uploading" class="mt-2">
            <div class="bg-gray-200 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: file.progress + '%' }"
              ></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ file.progress }}% completado</p>
          </div>
        </div>

        <!-- Actions -->
        <button 
          @click="removeFile(index)"
          class="text-red-500 hover:text-red-700 p-1"
          :disabled="file.uploading"
        >
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface FileItem {
  id: string
  file: File
  name: string
  size: number
  preview?: string
  uploading: boolean
  progress: number
}

interface Props {
  accept?: string
  maxSize?: number // bytes
  multiple?: boolean
  allowedTypes?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  accept: '*/*',
  maxSize: 10 * 1024 * 1024, // 10MB
  multiple: false,
  allowedTypes: () => []
})

const emit = defineEmits<{
  upload: [files: File[]]
  remove: [file: File]
  error: [errors: string[]]
}>()

const files = ref<FileItem[]>([])
const errors = ref<string[]>([])
const isDragging = ref(false)

const acceptText = computed(() => {
  if (props.allowedTypes.length) {
    return props.allowedTypes.join(', ')
  }
  return props.accept === '*/*' ? 'Cualquier tipo de archivo' : props.accept
})

const validateFile = (file: File): string[] => {
  const fileErrors: string[] = []
  
  // Size validation
  if (file.size > props.maxSize) {
    fileErrors.push(`${file.name}: Archivo muy grande (máximo ${formatFileSize(props.maxSize)})`)
  }
  
  // Type validation
  if (props.allowedTypes.length) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const isValidType = props.allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return type.slice(1) === fileExtension
      }
      return file.type.startsWith(type)
    })
    
    if (!isValidType) {
      fileErrors.push(`${file.name}: Tipo de archivo no permitido`)
    }
  }
  
  return fileErrors
}

const createPreview = (file: File): Promise<string | undefined> => {
  return new Promise((resolve) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.readAsDataURL(file)
    } else {
      resolve(undefined)
    }
  })
}

const addFiles = async (newFiles: File[]) => {
  errors.value = []
  const validFiles: File[] = []
  
  for (const file of newFiles) {
    const fileErrors = validateFile(file)
    if (fileErrors.length) {
      errors.value.push(...fileErrors)
      continue
    }
    
    // Check for duplicates
    if (files.value.some(f => f.name === file.name && f.size === file.size)) {
      errors.value.push(`${file.name}: Archivo ya seleccionado`)
      continue
    }
    
    validFiles.push(file)
  }
  
  // Add valid files
  for (const file of validFiles) {
    const preview = await createPreview(file)
    const fileItem: FileItem = {
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      preview,
      uploading: false,
      progress: 0
    }
    
    if (props.multiple) {
      files.value.push(fileItem)
    } else {
      files.value = [fileItem]
    }
  }
  
  if (validFiles.length) {
    emit('upload', validFiles)
  }
  
  if (errors.value.length) {
    emit('error', errors.value)
  }
}

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
    target.value = '' // Reset input
  }
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

const removeFile = (index: number) => {
  const fileItem = files.value[index]
  emit('remove', fileItem.file)
  files.value.splice(index, 1)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Simulate upload progress (for demo)
const simulateUpload = (fileItem: FileItem) => {
  fileItem.uploading = true
  fileItem.progress = 0
  
  const interval = setInterval(() => {
    fileItem.progress += Math.random() * 30
    if (fileItem.progress >= 100) {
      fileItem.progress = 100
      fileItem.uploading = false
      clearInterval(interval)
    }
  }, 200)
}

// Expose methods for parent component
defineExpose({
  simulateUpload,
  clearFiles: () => { files.value = [] },
  getFiles: () => files.value.map(f => f.file)
})
</script>
