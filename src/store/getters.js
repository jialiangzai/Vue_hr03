const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.staffPhoto,
  mobile: state => state.user.userInfo.mobile,
  name: state => state.user.userInfo.username,
  departmentName: state => state.user.userInfo.departmentName,
  workNumber: state => state.user.userInfo.workNumber
}
export default getters
