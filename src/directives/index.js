export const focus = {
  inserted(el, binding) {
    el.focus()
  }
}

export const imgerror = {
  inserted(el, binding) {
    el.onerror = function() {
      this.src = binding.value
    }
  }
}

