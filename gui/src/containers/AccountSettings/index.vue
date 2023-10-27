<template>
  <div class="flex flex-col mt-8 intro-y">
    <Tab.Group>
      <div class="px-5 pt-5 mt-5 intro-y box">
        <Tab.List variant="link-tabs" class="flex-col sm:flex-row justify-center text-center lg:justify-start">
          <Tab :fullWidth="false">
            <Tab.Button class="flex items-center py-4 cursor-pointer">
              <Lucide icon="User" class="w-4 h-4 mr-2" /> Account
            </Tab.Button>
          </Tab>
        </Tab.List>
      </div>

      <Tab.Panels class="box p-5 mt-5">
        <Tab.Panel class="flex flex-col space-y-6">
          <div class="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6">
            <div class="flex flex-col flex-grow">
              <FormLabel htmlFor="firstname">First name</FormLabel>
              <FormInput v-model="userProfileData.firstname" id="firstname" type="text" />
            </div>
            <div class="flex flex-col flex-grow">
              <FormLabel htmlFor="lastname">Last name</FormLabel>
              <FormInput v-model="userProfileData.lastname" id="lastname" type="text" />
            </div>
          </div>
          <div class="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6">
            <div class="flex flex-col flex-grow">
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormInput v-model="userProfileData.email" id="email" type="text" />
            </div>
            <div class="flex flex-col flex-grow">
              <FormLabel htmlFor="username">Username</FormLabel>
              <FormInput v-model="userProfileData.username" id="username" type="text" />
            </div>
          </div>
          <div class="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6">
            <div class="flex flex-col flex-grow">
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormInput v-model="userProfileData.password" id="password" type="password" />
            </div>
            <div class="flex flex-col flex-grow">
              <FormLabel htmlFor="confirmPassword">Confirm password</FormLabel>
              <FormInput v-model="userProfileData.confirmPassword" id="confirmPassword" type="password" />
            </div>
          </div>
          <div class="flex flex-col space-y-3 sm:space-y-0 sm:flex-row">
            <Button variant="primary" @click="onSaveHandler">Save changes</Button>
            <Button variant="outline-secondary" class="ml-0 sm:ml-2" @click="onCancelHandler">Cancel</Button>
          </div>
        </Tab.Panel>
        <Tab.Panel> Hello world </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  </div>
</template>

<script setup lang="ts">
import _ from "lodash"
import { SNACKBAR_MESSAGE_TYPES } from "@/constants"
import { reactive } from "vue"
import { useUserStore } from "@/store/modules/user.ts"
import { useUIStore } from "@/store/modules/ui.ts"
import { IUser, IUserPayload } from "@/interfaces/user.interface.ts"
import { Tab } from "@/base-components/Headless"
import { FormInput, FormLabel } from "@/base-components/Form"
import Lucide from "@/base-components/Lucide/Lucide"
import Button from "@/base-components/Button"

const userStore = useUserStore()
const uiStore = useUIStore()

const userProfileData = reactive<IUserPayload>({
  firstname: "",
  lastname: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: ""
})

/* const userInitials = computed(
  () => userProfileData.firstname.charAt(0).toUpperCase() + "" + userProfileData.lastname.charAt(0).toUpperCase()
) */

const getUserProfileInfo = async () => {
  const user = await userStore.retrieveUserInfo()
  setUserProfileData(user)
}

const setUserProfileData = (incomingUserData: IUser) => {
  Object.assign(userProfileData, {
    firstname: incomingUserData.firstname,
    lastname: incomingUserData.lastname,
    username: incomingUserData.username,
    email: incomingUserData.email
  })
}

const onSaveHandler = () => {
  const payload: Optional<IUserPayload, "confirmPassword"> = _.cloneDeep(userProfileData)
  delete payload.confirmPassword
  userStore.editUserProfile(payload).then((editedUser: IUser) => {
    setUserProfileData(editedUser)
    uiStore.setSnackbarMessage({
      message: "Successfully edited profile information",
      type: SNACKBAR_MESSAGE_TYPES.SUCCESS
    })
  })
}
const onCancelHandler = () => {}

getUserProfileInfo()
</script>
