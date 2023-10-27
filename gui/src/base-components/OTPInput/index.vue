<template>
  <div class="container mx-auto">
    <div class="max-w-sm mx-auto md:max-w-lg">
      <div class="py-3 text-center">
        <div ref="otpContainerRef" class="flex flex-row justify-center text-center px-2 mt-5">
          <input
            v-for="(el, ind) in digits"
            :key="el! + ind"
            :value="digits[ind]"
            :autofocus="ind === 0"
            :class="[
              'inline-block h-14 w-14 m-2 text-white bg-card-color text-center',
              'border-slate-200/60 dark:border-darkmode-400 focus:ring-0 focus:outline-none focus:border-danger-outlined-dark border-2 rounded-lg'
            ]"
            type="text"
            maxlength="1"
            @keydown="handleKeyDown($event, ind)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"

const emit = defineEmits(["update:otp"])

const props = defineProps({
  default: String,

  digitCount: {
    type: Number,
    required: true
  }
})

const digits: Array<string | null> = reactive([])

if (props.default && props.default.length === props.digitCount) {
  for (let i = 0; i < props.digitCount; i++) {
    digits[i] = props.default.charAt(i)
  }
} else {
  for (let i = 0; i < props.digitCount; i++) {
    digits[i] = null
  }
}

const otpContainerRef = ref()

const handleKeyDown = (event: KeyboardEvent, index: number) => {
  if (event.key !== "Tab" && event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
    event.preventDefault()
  }

  if (event.key === "Backspace") {
    digits[index] = null

    if (index != 0) {
      otpContainerRef.value.children[index - 1].focus()
    }

    return
  }

  if (new RegExp("^([0-9])$").test(event.key)) {
    digits[index] = event.key

    if (index != props.digitCount - 1) {
      otpContainerRef.value.children[index + 1].focus()
    }

    if (isDigitsFull()) {
      emit("update:otp", digits.join(""))
    }
  }
}

const isDigitsFull = function () {
  for (const elem of digits) {
    if (elem === null || elem === undefined) {
      return false
    }
  }

  return true
}
</script>
