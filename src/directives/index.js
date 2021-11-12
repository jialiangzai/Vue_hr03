// 隐式解构 imagerror就是键也是对象
/**
 * directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
 */
export const imagerror = {
  inserted (img, binding) {
    img.onerror = () => {
      img.src = binding.value
    }
  }
}
