<template>
  <form class="self-center my-auto md:box py-10 px-8 space-y-5 w-full md:w-[500px]" @submit.prevent="submitForm">
    <Logo />
    <div>
      <h1 class="text-lg">Welcome to NebulOuS</h1>
      <p class="text-sm text-color-secondary">Please sign-in your account and start an adventure</p>
    </div>
    <div class="flex flex-col space-y-2">
      <FormInput v-model="form.username" id="username" name="username" placeholder="Username" />
      <div v-if="v$.username.$error" class="text-sm text-danger">{{ v$.username.$errors[0].$message }}</div>
    </div>
    <div class="flex flex-col space-y-2">
      <FormInput
        v-model="form.password"
        id="password"
        type="password"
        name="password"
        placeholder="Password"
        autocomplete="on"
      />
      <div v-if="v$.password.$error" class="text-sm text-danger">{{ v$.password.$errors[0].$message }}</div>
    </div>
    <Button variant="primary" type="submit" class="w-full"> Login</Button>
    <!-- <p class="text-right">
        <a class="text-blue-600 text-sm font-light hover:underline"> Forgot Password? </a>
      </p> -->
  </form>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue"
import { useVuelidate } from "@vuelidate/core"
import { required, helpers } from "@vuelidate/validators"
import { VALIDATION_MESSAGES } from "@/constants"
import Logo from "@/base-components/Logo"
import Button from "@/base-components/Button"
import { FormInput } from "@/base-components/Form"
import { useUserStore } from "@/store/modules/user.ts"
import { ICredentials } from "@/interfaces/user.interface.ts"

const userStore = useUserStore()

const form = reactive<ICredentials>({
  username: "",
  password: ""
})

const rules = computed(() => {
  return {
    username: {
      required: helpers.withMessage(VALIDATION_MESSAGES.required, required)
      // email: helpers.withMessage(VALIDATION_MESSAGES.email, email)
    },
    password: {
      required: helpers.withMessage(VALIDATION_MESSAGES.required, required)
    }
  }
})

const v$ = useVuelidate(rules, form)

const submitForm = async () => {
  const isValid = await v$.value.$validate()
  if (isValid) await userStore.login(form)
  // await router.push({ name: "otp" })
}
</script>
