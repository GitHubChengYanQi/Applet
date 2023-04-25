<template>
  <FileUpload @input="(value)=>$emit('input',value)" />
</template>

<script>

import FileUpload from "../../../../components/Uploader/FileUpload";

export default {
  name: "fileId",
  components: {
    FileUpload,
  }
}
</script>

<style>
</style>
