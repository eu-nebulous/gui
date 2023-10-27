<template>
  <div class="flex flex-col text-start">
    <slot name="title"></slot>
    <Dialog.Description class="flex-col space-y-4 p-8">
      <div class="flex flex-col">
        <Label>Firstname</Label>
        <Input type="email" v-model="newUser.firstname" />
        <p v-if="v$.email.$error" class="text-error">{{ v$.firstname.$errors[0].$message }}</p>
      </div>
      <div class="flex flex-col">
        <Label>Lastname</Label>
        <Input type="email" v-model="newUser.lastname" />
        <p v-if="v$.email.$error" class="text-error">{{ v$.lastname.$errors[0].$message }}</p>
      </div>
      <div class="flex flex-col">
        <Label>Email</Label>
        <Input type="email" v-model="newUser.email" placeholder="example@gmail.com" />
        <p v-if="v$.email.$error" class="text-error">{{ v$.email.$errors[0].$message }}</p>
      </div>
      <div class="flex flex-col">
        <Label>Password</Label>
        <Input type="password" v-model="newUser.password" placeholder="*********" />
        <p v-if="v$.password.$error" class="text-error">{{ v$.password.$errors[0].$message }}</p>
      </div>
      <div class="flex flex-col">
        <Label>Confirm password</Label>
        <Input type="password" v-model="newUser.confirmPassword" placeholder="*********" />
        <p v-for="(error, errorIndex) in v$.confirmPassword.$errors" :key="errorIndex" class="text-error">
          {{ error.$message }}
        </p>
      </div>
    </Dialog.Description>
    <Dialog.Footer>
      <Button type="button" variant="outline-secondary" @click="closeModal(false)" class="w-20 mr-4"> Cancel </Button>
      <Button variant="primary" type="button" class="w-20" @click="createUser"> Create </Button>
    </Dialog.Footer>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue"
import _ from "lodash"
import { SNACKBAR_MESSAGE_TYPES } from "@/constants"
import { IUserPayload } from "@/interfaces/user.interface.ts"
import { useVuelidate } from "@vuelidate/core"
import { minLength, required, sameAs } from "@vuelidate/validators"
import { useUIStore } from "@/store/modules/ui.ts"
import { useUserStore } from "@/store/modules/user.ts"
import { Dialog } from "@/base-components/Headless"
import Button from "@/base-components/Button"
import Label from "@/base-components/Form/FormLabel.vue"
import Input from "@/base-components/Form/FormInput.vue"

const uiStore = useUIStore()
const userStore = useUserStore()

const newUser = reactive<IUserPayload>({
  firstname: "",
  lastname: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: ""
})

const rules = computed(function () {
  return {
    email: { required },
    firstname: { required },
    lastname: { required },
    password: { required, minLength: minLength(6), sameAsPassword: sameAs(newUser.confirmPassword) },
    confirmPassword: { required, minLength: minLength(6), sameAsPassword: sameAs(newUser.password) }
  }
})

const v$ = useVuelidate(rules, newUser)

const closeModal = (skipConfirmation: boolean = false) => {
  uiStore.setModalWindowState(null, skipConfirmation)
}

const createUser = async () => {
  const isValid = await v$.value.$validate()

  if (isValid) {
    newUser.username = newUser.email
    const payload: Optional<IUserPayload, "confirmPassword"> = _.cloneDeep(newUser)
    delete payload.confirmPassword
    userStore.createUser(payload).then(() => {
      closeModal(true)
      uiStore.setSnackbarMessage({
        message: `Successfully created user ${payload.username}`,
        type: SNACKBAR_MESSAGE_TYPES.SUCCESS
      })
    })
  }
}
</script>
