<template>
 <view>
   <FileUpload @input="(value)=>$emit('input',value)" />
 </view>
</template>

<script>


import FileUpload from "../../../../components/Uploader/FileUpload";
export default {
  name: "drawing",
  components: {
    FileUpload
  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="scss">

.files {
  padding-bottom: 8px;
}

.fileItem {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f5f5f5;
  padding: 8px 12px;
  margin-bottom: 8px;

  .fileName {
    flex-grow: 1;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      width: calc(100vw - 230px);
    }
  }
}
</style>
