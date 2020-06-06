<template>
  <div :class="$options.name">
    <el-upload
      v-show="!resultImg"
      class="upload-el"
      accept="image/*"
      ref="fileUpload"
      name="pic"
      :action="action"
      :data="uploadData"
      :on-change="selectChange"
      :show-file-list="false"
      :auto-upload="false"
      :http-request="httpRequest">
      <div>
        <span
          class="icon upload-icon" />
        <el-button>选择图片</el-button>
      </div>
      <div
        slot="tip"
        class="el-upload__tip">
        图片大小不超过5M，推荐图片尺寸宽高比9:16
      </div>
    </el-upload>
    <figure
      v-show="resultImg"
      class="result-img">
      <img
        :src="resultImg">
      <el-button
        @click="updateCropper">重新上传</el-button>
    </figure>
    <cropper
      v-if="showCropper"
      :dialog-visible="showCropper"
      :cropper-img="cropperImg"
      @update-cropper="updateCropper"
      @colse-dialog="closeDialog"
      @upload-img="uploadImg" />
  </div>
</template>

<script>
import Cropper from './Cropper.vue';
import axios from '@/common/axios';
import { loading } from '@/common';
export default {
  name: 'UploadImg',
  components: {
    Cropper
  },
  data () {
    return {
      uploadData: { // 上传需要的额外参数
        siteId: 1,
        source: 1,
        fileName: ''
      },
      action: 'https://jsonplaceholder.typicode.com/posts/', // 上传地址，必填
      cropperImg: '', // 需要裁剪的图片
      showCropper: false, // 是否显示裁剪框
      uploadFile: '', // 裁剪后的文件
      resultImg: '' // 上传成功，后台返回的路径
    };
  },
  methods: {
    // submit 之后会触发此方法
    httpRequest (request) {
      const { action, data, filename } = request;
      // 新建formDate对象
      let formData = new FormData();
      for (let key in data) {
        formData.append(key, data[key]);
      }
      // 文件单独push,第三个参数指定上传的文件名
      formData.append(filename, this.uploadFile, data.fileName);
      loading.start(); // 上传中的loading
      axios.baseAxios({
        headers: {
          contentType: 'multipart/form-data' // 需要指定上传的方式
        },
        url: action,
        method: 'post',
        data: formData,
        timeout: 200000000 // 防止文件过大超时
      }).then(({ data: resp }) => {
        loading.close();
        const { code, data, msg } = resp || {};
        if (code === 0) {
          this.$message.success('图片上传成功');
          this.resultImg = data; // 上传成功后展示的图片
        } else {
          this.$message.error(msg || '网络错误');
        }
      }).catch(err => {
        loading.close();
        console.log(err);
      });
    },
    // 选择文件
    selectChange (file) {
      const { raw, name } = file;
      this.openCropper(raw);
      this.uploadData.fileName = name;
    },
    /**
     * @param {file} 上传的文件
      */
    openCropper (file) {
      var files = file;
      let isLt5M = files.size > (5 << 20);
      if (isLt5M) {
        this.$message.error('请上传5M内的图片');
        return false;
      }
      var reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        this.cropperImg = data;
      };
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(files);
      this.showCropper = true;
    },
    // 上传图片
    uploadImg (file) {
      this.uploadFile = file;
      this.$refs.fileUpload.submit();
    },
    // 更新图片
    updateCropper () {
      this.$refs.fileUpload.$children[0].$el.click();
    },
    // 关闭窗口
    closeDialog () {
      this.showCropper = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.UploadImg {
  .el-upload {
    display: block;
    width: 100px;
    margin: 30px auto 0;
  }
  .upload-icon {
    display: block;
    margin: 0 auto;
    height: 44px;
    width: 52px;
    background-image: url(~@/assets/img/upload-image.png);
    background-position: 100% 100%;
    margin-bottom: 20px;
  }
  .video-image {
    display: flex;
    figure {
      width: 100px;
      img {
        width: 100%;
        display: block;
      }
    }
  }
}
</style>
