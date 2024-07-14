<template>
  <form>
  <Dialog.Description class="grid grid-cols-3 gap-4 p-4" :class=" availableInPlatform(['OPENSTACK','AWS']) ?  'grid-cols-3' : 'grid-cols-2' "
  >
    <div class="col-span-3 p-0">
      <div class="mb-3">
        <Label>Name</Label>
        <Input
            type="text"
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
      <div v-if="availableInPlatform(['OPENSTACK','AWS'])"
           class="flex flex-col"
      >
        <div class="mt-4 mb-3">
          <Label>Regions</Label>
          <div               v-if="availableInPlatform(['AWS'])"
          >

          <TomSelect
              v-model="resourceData.regions"
              class="w-full"
              multiple
          >
            <template v-if="availableRegions['AWS'].length">
              <option
                  v-for="(option, componentOptionIndex) in availableRegions['AWS']"
                  :key="componentOptionIndex"
                  :value="option.region"
              >
                {{ option.region }} ({{option.region_name}})
              </option>
            </template>
          </TomSelect>
          </div>
          <Input type="text"
                 v-if="availableInPlatform(['OPENSTACK'])"
                 v-model="resourceData.regions"/>
        </div>
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
            autocomplete="false"
            type="password"
            v-model="resourceData.sshCredentials.keyPairName"
        />
      </div>

      <div class="flex flex-col"
           v-if="availableInPlatform(['OPENSTACK','AWS'])"
      >
        <Label>Key Private Key</Label>
        <Input
            autocomplete="false"
            type="password"
            v-model="resourceData.sshCredentials.privateKey"
        />
      </div>

    </div>
  </Dialog.Description>
  </form>
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
import TomSelect from "@/base-components/TomSelect";

const resourceStore = useResourceStore()

const props = defineProps(['resourceData','rules'])

const resourceData = ref<IResourcePayload>(props.resourceData)
console.log(resourceData)
const availableRegions = {
  'AWS':[
    {
      "region_name": "US East (Ohio)",
      "region": "us-east-2",
      "endpoints": [
        "rds.us-east-2.amazonaws.com",
        "rds-fips.us-east-2.api.aws",
        "rds.us-east-2.api.aws",
        "rds-fips.us-east-2.amazonaws.com"
      ],
      "protocol": ["HTTPS", "HTTPS", "HTTPS", "HTTPS"]
    },
    {
      "region_name": "US East (N. Virginia)",
      "region": "us-east-1",
      "endpoints": [
        "rds.us-east-1.amazonaws.com",
        "rds-fips.us-east-1.api.aws",
        "rds-fips.us-east-1.amazonaws.com",
        "rds.us-east-1.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS", "HTTPS", "HTTPS"]
    },
    {
      "region_name": "US West (N. California)",
      "region": "us-west-1",
      "endpoints": [
        "rds.us-west-1.amazonaws.com",
        "rds.us-west-1.api.aws",
        "rds-fips.us-west-1.amazonaws.com",
        "rds-fips.us-west-1.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS", "HTTPS", "HTTPS"]
    },
    {
      "region_name": "US West (Oregon)",
      "region": "us-west-2",
      "endpoints": [
        "rds.us-west-2.amazonaws.com",
        "rds-fips.us-west-2.amazonaws.com",
        "rds.us-west-2.api.aws",
        "rds-fips.us-west-2.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS", "HTTPS", "HTTPS"]
    },
    {
      "region_name": "Africa (Cape Town)",
      "region": "af-south-1",
      "endpoints": [
        "rds.af-south-1.amazonaws.com",
        "rds.af-south-1.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Asia Pacific (Hong Kong)",
      "region": "ap-east-1",
      "endpoints": [
        "rds.ap-east-1.amazonaws.com",
        "rds.ap-east-1.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Asia Pacific (Hyderabad)",
      "region": "ap-south-2",
      "endpoints": [
        "rds.ap-south-2.amazonaws.com",
        "rds.ap-south-2.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Asia Pacific (Jakarta)",
      "region": "ap-southeast-3",
      "endpoints": [
        "rds.ap-southeast-3.amazonaws.com",
        "rds.ap-southeast-3.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Asia Pacific (Melbourne)",
      "region": "ap-southeast-4",
      "endpoints": [
        "rds.ap-southeast-4.amazonaws.com",
        "rds.ap-southeast-4.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Asia Pacific (Mumbai)",
      "region": "ap-south-1",
      "endpoints": [
        "rds.ap-south-1.amazonaws.com",
        "rds.ap-south-1.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Asia Pacific (Osaka)",
      "region": "ap-northeast-3",
      "endpoints": [
        "rds.ap-northeast-3.amazonaws.com",
        "rds.ap-northeast-3.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Asia Pacific (Seoul)",
      "region": "ap-northeast-2",
      "endpoints": [
        "rds.ap-northeast-2.amazonaws.com",
        "rds.ap-northeast-2.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Asia Pacific (Singapore)",
      "region": "ap-southeast-1",
      "endpoints": [
        "rds.ap-southeast-1.amazonaws.com",
        "rds.ap-southeast-1.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Asia Pacific (Sydney)",
      "region": "ap-southeast-2",
      "endpoints": [
        "rds.ap-southeast-2.amazonaws.com",
        "rds.ap-southeast-2.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Asia Pacific (Tokyo)",
      "region": "ap-northeast-1",
      "endpoints": [
        "rds.ap-northeast-1.amazonaws.com",
        "rds.ap-northeast-1.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Canada (Central)",
      "region": "ca-central-1",
      "endpoints": [
        "rds.ca-central-1.amazonaws.com",
        "rds.ca-central-1.api.aws",
        "rds-fips.ca-central-1.api.aws",
        "rds-fips.ca-central-1.amazonaws.com"
      ],
      "protocol": ["HTTPS", "HTTPS", "HTTPS", "HTTPS"]
    },
    {
      "region_name": "Canada West (Calgary)",
      "region": "ca-west-1",
      "endpoints": [
        "rds.ca-west-1.amazonaws.com",
        "rds-fips.ca-west-1.amazonaws.com"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Europe (Frankfurt)",
      "region": "eu-central-1",
      "endpoints": [
        "rds.eu-central-1.amazonaws.com",
        "rds.eu-central-1.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Europe (Ireland)",
      "region": "eu-west-1",
      "endpoints": [
        "rds.eu-west-1.amazonaws.com",
        "rds.eu-west-1.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Europe (London)",
      "region": "eu-west-2",
      "endpoints": [
        "rds.eu-west-2.amazonaws.com",
        "rds.eu-west-2.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Europe (Milan)",
      "region": "eu-south-1",
      "endpoints": [
        "rds.eu-south-1.amazonaws.com",
        "rds.eu-south-1.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Europe (Paris)",
      "region": "eu-west-3",
      "endpoints": [
        "rds.eu-west-3.amazonaws.com",
        "rds.eu-west-3.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Europe (Spain)",
      "region": "eu-south-2",
      "endpoints": [
        "rds.eu-south-2.amazonaws.com",
        "rds.eu-south-2.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Europe (Stockholm)",
      "region": "eu-north-1",
      "endpoints": [
        "rds.eu-north-1.amazonaws.com",
        "rds.eu-north-1.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Europe (Zurich)",
      "region": "eu-central-2",
      "endpoints": [
        "rds.eu-central-2.amazonaws.com",
        "rds.eu-central-2.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Israel (Tel Aviv)",
      "region": "il-central-1",
      "endpoints": [
        "rds.il-central-1.amazonaws.com",
        "rds.il-central-1.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Middle East (Bahrain)",
      "region": "me-south-1",
      "endpoints": [
        "rds.me-south-1.amazonaws.com",
        "rds.me-south-1.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "Middle East (UAE)",
      "region": "me-central-1",
      "endpoints": [
        "rds.me-central-1.amazonaws.com",
        "rds.me-central-1.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "South America (São Paulo)",
      "region": "sa-east-1",
      "endpoints": [
        "rds.sa-east-1.amazonaws.com",
        "rds.sa-east-1.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "AWS GovCloud (US-East)",
      "region": "us-gov-east-1",
      "endpoints": [
        "rds.us-gov-east-1.amazonaws.com",
        "rds.us-gov-east-1.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    },
    {
      "region_name": "AWS GovCloud (US-West)",
      "region": "us-gov-west-1",
      "endpoints": [
        "rds.us-gov-west-1.amazonaws.com",
        "rds.us-gov-west-1.api.aws"
      ],
      "protocol": ["HTTPS", "HTTPS"]
    }
  ]
}
const rules = ref<IResourcePayload>(props.rules)

const $externalResults = reactive({})
const v$ = useVuelidate(rules.value, resourceData.value, { $externalResults })


const platformsOptions = ref<Array<IPlatform>>([])
const availableInPlatform = (platforms:Array<string>): boolean => {

  if(!platformsOptions.value){
    return false
  }

  const to_uuid:Array<string> = []
  _.each(platformsOptions.value, (k)=>{
    if(platforms.includes(k.title)){
      to_uuid.push(k.uuid)
    }
  })
  return to_uuid.includes(resourceData.value.platform.uuid)
}
const getPlatforms = async () => {
  console.log(resourceStore)
  const p = await resourceStore.getPlatforms()
  console.log(p)
  platformsOptions.value =p
}
getPlatforms()



</script>