<template>
  <view class="">
    <view class="files" v-if="files.length > 0">
      <view
          v-for="(file,index) in files"
          :key="index"
          class="fileItem"
      >
        <u--image
            v-if="['jpg', 'jpeg', 'png', 'webp'].includes(file.type)"
            :showLoading="true"
            :src="file.url"
            :width="30"
            :height="30"
        />
        <u-icon v-else name="file-text" color="#2979ff" size="30" />
        <view class="fileName">
          <view class="name" :style="{width:nameWidth}">
            {{ file.name }}
          </view>
        </view>
        <LinkButton @click="remove(file)">
          <u-icon color="#dd524d" name="trash"></u-icon>
        </LinkButton>

      </view>
    </view>
    <Uploader file @onChange="onChange" />
  </view>
</template>

<script>

import LinkButton from "../../LinkButton";
import Uploader from "../index";

export default {
  name: "FileUpload",
  components: {
    Uploader,
    LinkButton
  },
  props:['nameWidth'],
  data() {
    return {
      files: []
    }
  },
  methods: {
    onChange(file) {
      const files = [...this.files, file]
      this.save(files)
    },
    remove(file) {
      const files = this.files.filter(item => item.id !== file.id)
      this.save(files)
    },
    save(files) {
      this.files = files
      const value = files.map(item => item.id).join(',')
      this.$emit('input', value)
      this.$emit('change', value)
    }
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
