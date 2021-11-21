<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <div class="app-breadcrumb">
      {{ $t("navbar.title") }}
      <span class="breadBtn">体验版</span>
    </div>
    <!-- <breadcrumb class="breadcrumb-container" /> -->

    <div class="right-menu">
      <!-- 多语言化 -->
      <Lang class="rm-item" />
      <!-- 全屏 -->
      <ScreenFull class="rm-item" />
      <el-dropdown class="avatar-container" trigger="hover">
        <!-- 头像 -->
        <div class="avatar-wrapper">
          <img v-imagerror="defaultImg" :src="avatar" class="user-avatar" />
          <span class="name">{{ name }}</span>
          <i class="el-icon-caret-bottom" style="color: #fff" />
        </div>
        <!-- 下拉 -->
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> {{ $t("navbar.dashboard") }} </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://gitee.com">
            <el-dropdown-item> {{ $t("navbar.github") }} </el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block"> {{ $t("navbar.logOut") }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
// 头像默认
import defaultImg from '@/assets/common/head.jpg'
export default {
  components: {
    Hamburger
  },
  data () {
    return {
      defaultImg
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'mobile',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout () {
      // 提示对话框
      try {
        await this.$confirm('确认退出登录吗?', '提示')
        // console.log(this.$route)fullPath和path一般是一致但是fullPath匹配路由，path匹配路径。
        await this.$store.dispatch('user/logout')
        // 主动退出考虑用户的体验
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  // background: #fff;
  background-image: -webkit-linear-gradient(left, #5b8cff, #3d6df8);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  // 汉堡包按钮
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }
  // 面包屑导航
  .app-breadcrumb {
    display: inline-block;
    font-size: 18px;
    line-height: 50px;
    margin-left: 10px;
    color: #ffffff;
    cursor: text;
    .breadBtn {
      background: #84a9fe;
      font-size: 14px;
      padding: 0 10px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      border-radius: 10px;
      margin-left: 15px;
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    .rm-item {
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
    }

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      // 头像
      // 右侧头像等显示控制
      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 15px;
          vertical-align: middle;
        }
        .name {
          color: #fff;
          vertical-align: middle;
          margin-left: 5px;
        }
        .user-dropdown {
          color: #fff;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
