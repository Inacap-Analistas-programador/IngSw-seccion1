<template>
  <div class="file-uploader">
    <label class="file-label">
      <input type="file" @change="onFileChange" />
      <span><slot>Seleccionar archivo</slot></span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'FileUploader',
  methods: {
    onFileChange(e) {
      const file = e.target.files && e.target.files[0]
      if (file) this.$emit('upload', file)
    }
  }
}
</script>

<style scoped>
.file-label input { display: none; }
.file-label { cursor: pointer; color: #1e88e5; }
</style>
