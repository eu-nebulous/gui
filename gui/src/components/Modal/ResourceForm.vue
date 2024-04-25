<template>
  <Dialog.Description class="grid grid-cols-3 gap-4 p-4" :class=" availableInPlatform(['OPENSTACK','AWS']) ?  'grid-cols-3' : 'grid-cols-2' "
  >
    <div class="col-span-3 p-0">
      <div class="mb-3">
        <Label>Name</Label>
        <Input
            type="email"
            v-model="resourceData.title"
            :class="{
            'input--invalid': v$.title.$error
          }"
        />
      </div>
      <div class="flex flex-col">
        <Label>Platform</Label>
        <Select
            v-model="resourceData.platform.uuid"
            :class="{
            'input--invalid': v$.platform.$error
          }"
        >
          <option v-for="(platform, index) in platformsOptions" :key="index" :value="platform.uuid">
            {{ platform.title }}
          </option>
        </Select>
      </div>
    </div>
    <div class="flex flex-col">
      <h3 class="font-bold text-lg mb-2">General</h3>

      <div class="flex flex-col">
        <Label>Default Network</Label>
        <Input
            type="text"
            v-model="resourceData.defaultNetwork"
        />
      </div>
      <div class="flex flex-col">
        <Label>Subnet</Label>
        <Input
            type="text"
            v-model="resourceData.subnet"
        />
      </div>

      <div class="flex flex-col">
        <Label>Endpoint</Label>
        <Input
            type="text"
            v-model="resourceData.endpoint"
        />
      </div>

      <div class="flex flex-col">
        <Label>Identity Version</Label>
        <Input
            type="text"
            v-model="resourceData.identityVersion"
        />
      </div>
      <div class="flex flex-col">
        <Label>Security Group</Label>
        <Input
            type="text"
            v-model="resourceData.securityGroup"
        />
      </div>

    </div>
    <div class="flex flex-col">
      <h3 class="font-bold text-lg mb-2">Credentials</h3>
      <div class="flex flex-col">
        <Label>Username</Label>
        <Input
            type="text"
            v-model="resourceData.credentials.user"
        />
      </div>
      <div class="flex flex-col">
        <Label>Secret</Label>
        <Input
            type="text"
            v-model="resourceData.credentials.secret"
        />
      </div>

      <div class="flex flex-col">
        <Label>Domain</Label>
        <Input
            type="text"
            v-model="resourceData.credentials.domain"
        />
      </div>


    </div>
    <div class="flex flex-col">

      <h3 class="font-bold text-lg mb-2"
          v-if="availableInPlatform(['OPENSTACK','AWS'])"
      >SSH Credentials</h3>


      <div class="flex flex-col"
           v-if="availableInPlatform(['OPENSTACK','AWS'])"
      >
        <Label>Username</Label>
        <Input
            type="text"
            v-model="resourceData.sshCredentials.username"

        />
      </div>

      <div class="flex flex-col"
           v-if="availableInPlatform(['OPENSTACK','AWS'])"
      >
        <Label>Key Pair Name</Label>
        <Input
            type="text"
            v-model="resourceData.sshCredentials.keyPairName"
        />
      </div>

      <div class="flex flex-col"
           v-if="availableInPlatform(['OPENSTACK','AWS'])"
      >
        <Label>Key Private Key</Label>
        <FormTextarea
            v-model="resourceData.sshCredentials.privateKey"
        />
      </div>

    </div>
  </Dialog.Description>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue"
import {FormTextarea} from "@/base-components/Form";
import { Dialog } from "@/base-components/Headless"
import Input from "../../base-components/Form/FormInput.vue";
import Label from "../../base-components/Form/FormLabel.vue";
import Select from "../../base-components/Form/FormSelect.vue";
import _ from "lodash";
import {IPlatform} from "@/interfaces/platform.interface.ts";
import {useResourceStore} from "@/store/modules/resources.ts";
import {IResourcePayload} from "@/types/resource.ts";
import {useVuelidate} from "@vuelidate/core";

const resourceStore = useResourceStore()

const props = defineProps(['resourceData','rules'])

const resourceData = ref<IResourcePayload>(props.resourceData)
const rules = ref<IResourcePayload>(props.rules)

console.log("Resource Data", resourceData)

const $externalResults = reactive({})
const v$ = useVuelidate(rules.value, resourceData.value, { $externalResults })


const platformsOptions = ref<Array<IPlatform>>([])
const availableInPlatform = (platforms:Array<string>): boolean => {

  const to_uuid:Array<string> = []
  const availableOptions = _.each(platformsOptions.value, (k)=>{
    if(platforms.includes(k.title)){
      to_uuid.push(k.uuid)
    }
  })
  return to_uuid.includes(resourceData.value.platform.uuid)
}
const getPlatforms = async () => {
  platformsOptions.value = await resourceStore.getPlatforms()
}
getPlatforms()



</script>