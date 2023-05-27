<template>
  <view class="">
    <view class="files" v-if="value.length > 0">
      <view
          v-for="(file,index) in value"
          :key="index"
          class="fileItem"
          :style="{marginBottom:(index === value.length - 1) ? 0 : 8}"
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
            {{ file.name || '' }}
          </view>
        </view>
        <LinkButton v-if="!show" @click="remove(file)">
          <u-icon color="#dd524d" name="trash"></u-icon>
        </LinkButton>

      </view>
    </view>
    <Uploader v-if="!show" @loading="(loading)=>$emit('onLoading',loading)" file @onChange="onChange">
      <slot>
        <u-button size="small" customStyle="width:100px;margin-top:12px">
          <view class="uploadFile">
            <uni-icons type="upload"></uni-icons>
            上传
          </view>
        </u-button>
      </slot>
    </Uploader>
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
  props: {
    show: Boolean,
    nameWidth: String,
    value: {
      type: Array,
      default: _ => []
    }
  },
  data() {
    return {}
  },
  methods: {
    onChange(file) {
      const files = [...this.value, file]
      this.save(files)
    },
    remove(file) {
      const files = this.value.filter(item => item.id !== file.id)
      this.save(files)
    },
    save(files) {
      this.$emit('input', files)
    }
  }
}
</script>

<style lang="scss">

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
