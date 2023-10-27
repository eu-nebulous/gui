<template>
  <transition name="expand" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter" @leave="leave">
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: "ExpandTransition",
  methods: {
    beforeEnter(element) {
      element.style.position = "absolute"
      element.style.visibility = "hidden"
      element.style.height = "auto"
    },

    enter(element) {
      const height = getComputedStyle(element).height
      element.style.position = null
      element.style.visibility = null
      element.style.height = 0

      requestAnimationFrame(() => {
        element.style.height = height
      })
    },

    afterEnter(element) {
      element.style.height = "auto"
    },

    leave(element) {
      element.style.height = getComputedStyle(element).height

      requestAnimationFrame(() => {
        element.style.height = 0
      })
    }
  }
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  overflow: hidden;
  transition:
    height 1s ease-in-out,
    opacity 1s ease-in-out;
  transform-origin: top;
}

.expand-enter-from,
.expand-leave-to {
  height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
}
</style>
