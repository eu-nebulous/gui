<template>
  <div class="w-screen h-screen flex justify-center items-center">
    <form
      class="p-10 y-intro box bg-card-color rounded-xl drop-shadow-lg space-y-5 w-[500px]"
      @submit.prevent="submitForm"
    >
      <Logo />
      <div>
        <h1 class="text-lg">Two StepVerification</h1>
        <p class="text-sm text-color-secondary">
          We sent a verification code to your mobile
          <b>+91 ******876</b>. Enter the code from the mobile in the field below.
        </p>
      </div>
      <Button variant="primary" type="submit" class="w-full" @click="skipOtp"> Skip for now </Button>
      <OTP :digit-count="6" @update:otp="otpValue = $event"></OTP>

      <div class="flex justify-center text-center mt-5">
        <a class="flex items-center">
          <p>Didn't get the code?</p>
          <p class="ml-1 font-bold cursor-pointer text-primary-light hover:text-primary-hover">Resend OTP</p>
          <i class="bx bx-caret-right ml-1"></i>
        </a>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import Logo from "@/base-components/Logo"
import Button from "@/base-components/Button"
import OTP from "@/base-components/OTPInput"

const router = useRouter()

const otpValue = ref("")

const submitForm = () => {}

const skipOtp = async () => {
  await router.push({ name: "applications" })
}
</script>
