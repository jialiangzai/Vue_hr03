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
    <!-- 进度条 -->
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    <el-progress
      v-if="showPercent"
      class="progress"
      type="circle"
      :stroke-width="6"
      :percentage="percentage"
    ></el-progress>
  </el-upload>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKID2JMPE1qvDJCmTvdDTqxFgssaAVbRkxoR', // 身份识别ID
  SecretKey: 'Xw62h4GDwa4JIzUGqKgZyCAzwf9N5f06' // 身份秘钥
})
export default {
  name: 'UploadImg',
  data () {
    return {
      //  存储云返回的图片地址
      imageUrl: '',
      // 进度条 0-100
      percentage: 0,
      showPercent: false
    }
  },
  methods: {
    // 上云的文件信息
    uploadImg (params) {
      this.showPercent = true
      // 后续调用腾讯云cos后台接口上传图片
      console.log('选中的图片地址为', params)
      // 两个参数
      cos.putObject({
        Bucket: 'hrsass-1255477649', /* 必须 */
        Region: 'ap-beijing', /* 存储桶所在地域，必须字段 */
        Key: params.file.name, /* 必须(上传文件文件名) */
        StorageClass: 'STANDARD', // 标准模式存储
        Body: params.file, // 上传文件对象
        // 进度条
        onProgress: (progressData) => {
          // 上传进度（数值%）
          // console.log(JSON.stringify(progressData.percent))
          this.percentage = progressData.percent * 100
          console.log('当前图片的上传进度：', progressData.percent)
        }
        // 第二个参数表示成功回调函数一定要是一个箭头函数
      }, (error, data) => {
        // err 是null 表明上传成功 data 会包含Location图片存储地址
        if (!error) {
          // 显示上传成功后的图片并关闭进度条
          if (data.statusCode === 200) {
            // 网速过快 通过延迟函数看进度条效果
            setTimeout(() => {
              this.showPercent = false
              this.percentage = 0
              this.imageUrl = `https://${data.Location}`
            }, 800)
          }
        } else {
          this.$message.error('上传失败')
        }
      })
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
// 进度条
.progress {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
}
</style>
