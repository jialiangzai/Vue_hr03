<template>
  <!--
  上传组件props：
  1. action 后台上传接口地址
  2. show-file-list 是否显示上传文件的列表
  3. on-success 上传成功之后执行的回调函数（和action配合使用）
  4. before-upload 上传之前执行的回调函数（文件格式、大小检验）
  5. http-request 自定义上传函数（自己写发请求上传的逻辑）
 -->
  <el-upload
    class="avatar-uploader"
    action="#"
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :http-request="uploadImg"
  >
    <!-- 默认插槽=》 默认显示+号图标=》上传有图片了=》就显示上传图片-->
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
export default {
  name: 'UploadImg',
  data () {
    return {
      //  存储上传的图片地址
      imageUrl: ''
    }
  },
  methods: {
    // 上云的文件信息
    uploadImg (params) {
      // 后续调用腾讯云cos后台接口上传图片
      console.log('选中的图片地址为', params)
      // this.imageUrl = params.file
    },
    // 上传腾讯云前的校验 必须return true
    beforeAvatarUpload (file) {
      // const isJPG = file.type === 'image/jpeg'
      // const isLt2M = file.size / 1024 / 1024 < 2

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!')
      // }
      // return isJPG && isLt2M
      return true
    }
  }
}
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
