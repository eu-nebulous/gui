<template>
  <form>
    <Dialog.Description class="grid grid-cols-3 gap-4 p-4"
                        :class=" availableInPlatform(['OPENSTACK','AWS']) ?  'grid-cols-3' : 'grid-cols-2' "
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
            <div v-if="availableInPlatform(['AWS'])"
            >
              <VueMultiselect
                  v-model="resourceData.regions"
                  :close-on-select="true"
                  :clear-on-select="false"
                  :multiple="true"
                  placeholder="Select Region"
                  label="region_name"
                  track-by="region"
                  :options="availableRegions['AWS']">
              </VueMultiselect>
            </div>
            <Input type="text"
                   v-if="availableInPlatform(['OPENSTACK'])"
                   v-model="resourceData.regions"/>
          </div>
        </div>
        <div v-if="availableInPlatform(['AWS'])"
             class="flex flex-col"
        >
          <div class="mt-4 mb-3">
            <Label>Valid Instance Types</Label>
            <div v-if="availableInPlatform(['AWS'])"
            >
              <VueMultiselect
                  v-model="resourceData.validInstanceTypes"
                  :close-on-select="true"
                  :clear-on-select="false"
                  :multiple="true"
                  placeholder="Select Valid Instance Types"
                  label="instanceType"
                  track-by="instanceType"
                  :options="availableInstanceTypes">
              </VueMultiselect>
            </div>
            
          </div>
        </div>
        <div v-if="availableInPlatform(['OPENSTACK'])"
             class="flex flex-col"
        >
          <div class="mt-4 mb-3">
            <Label>Scope</Label>
            <div v-if="availableInPlatform(['OPENSTACK'])"
            >
              <Select
              v-model="resourceData.scope"
              :class="{
                'input--invalid': v$.platform.$error
              }"
              >
                <option v-for="(scope, index) in availableScopes" :key="index" :value="scope.value">
                  {{ scope.label }}
                </option>
              </Select>
            </div>

          </div>
          <div class="mt-4 mb-3">
            <Label>Project</Label>
            <div v-if="availableInPlatform(['OPENSTACK'])"
            >
              <Input
              v-model="resourceData.project"
              :class="{
                'input--invalid': v$.platform.$error
              }"
              >
                <option v-for="(scope, index) in availableScopes" :key="index" :value="scope.value">
                  {{ scope.label }}
                </option>
              </Input>
            </div>

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
              :class="{
            'input--invalid': v$.credentials.user.$error
          }"
          />
        </div>
        <div class="flex flex-col">
          <Label>Secret</Label>
          <Input
              type="password"
              v-model="resourceData.credentials.secret"
              :class="{
            'input--invalid': v$.credentials.secret.$error
          }"
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
          <div class="relative">
            <TextArea
                v-model="resourceData.sshCredentials.privateKey"
                v-if="showPrivateKey"
                rows="5"
                class="form-textarea"
                style="white-space: pre-wrap;"
            ></TextArea>
            <TextArea
                :value="maskedPrivateKey"
                v-else
                rows="5"
                class="form-textarea"
                style="white-space: pre-wrap;"
                readonly
            ></TextArea>

            <Button type="button" size="sm" variant="outline-secondary" @click="togglePrivateKeyVisibility" class="absolute right-3 top-2">
              {{ showPrivateKey ? 'Hide' : 'Show' }}
            </button>
        </div>

      </div>
      </div>
    </Dialog.Description>
  </form>
</template>
<script setup lang="ts">
import {computed, watch, reactive, ref} from "vue"
import {Dialog} from "@/base-components/Headless"
import Input from "../../base-components/Form/FormInput.vue";
import TextArea from "../../base-components/Form/FormTextarea.vue";
import Label from "../../base-components/Form/FormLabel.vue";
import Select from "../../base-components/Form/FormSelect.vue";
import _ from "lodash";
import {IPlatform} from "@/interfaces/platform.interface.ts";
import {useResourceStore} from "@/store/modules/resources.ts";
import {IResourcePayload} from "@/types/resource.ts";
import {useVuelidate} from "@vuelidate/core";
import VueMultiselect from "vue-multiselect";
import {IRegion, IRegions, IType, ITypes} from "@/interfaces/resources.interface.ts";
import Button from "@/base-components/Button";

const resourceStore = useResourceStore()

const props = defineProps(['resourceData', 'rules', 'isEditing']);


const resourceData = ref<IResourcePayload>(props.resourceData)


const showPrivateKey = ref(!props.isEditing);


const maskedPrivateKey = computed(() => {
  return props.resourceData.sshCredentials.privateKey.replace(/./g, '*');
});
const togglePrivateKeyVisibility = () => {
  showPrivateKey.value = !showPrivateKey.value;
}

const availableScopes = [
  { label: "project" , value: "project"},
  { label: "projectId" , value: "projectId"},
  { label: "domain" , value: "domain"},
  { label: "domainId" , value: "domainId"}
]

const availableRegions:IRegions = {
  'AWS': [
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

const availableInstanceTypes = ref<IType[]>([
  { instanceType: 'c6g.medium' },
  { instanceType: 'm6g.medium' },
  { instanceType: 'm6gd.medium' },
  { instanceType: 'r6g.medium' },
  { instanceType: 't3.nano' },
  { instanceType: 't4g.nano' },
  { instanceType: 't3.micro' },
  { instanceType: 't4g.micro' },
  { instanceType: 't3.small' },
  { instanceType: 't4g.small' },
  { instanceType: 'c5.large' },
  { instanceType: 'c5a.large' },
  { instanceType: 'c5ad.large' },
  { instanceType: 'c5d.large' },
  { instanceType: 'c6g.large' },
  { instanceType: 'c6i.large' },
  { instanceType: 'c6in.large' },
  { instanceType: 't3.medium' },
  { instanceType: 't4g.medium' },
  { instanceType: 'c5n.large' },
  { instanceType: 'm5.large' },
  { instanceType: 'm5d.large' },
  { instanceType: 'm6g.large' },
  { instanceType: 'm6gd.large' },
  { instanceType: 'm6i.large' },
  { instanceType: 't3.large' },
  { instanceType: 't4g.large' },
  { instanceType: 'i3.large' },
  { instanceType: 'i3en.large' },
  { instanceType: 'i4i.large' },
  { instanceType: 'r5.large' },
  { instanceType: 'r5d.large' },
  { instanceType: 'r5dn.large' },
  { instanceType: 'r5n.large' },
  { instanceType: 'r6g.large' },
  { instanceType: 'r6i.large' },
  { instanceType: 'c5.xlarge' },
  { instanceType: 'c5a.xlarge' },
  { instanceType: 'c5ad.xlarge' },
  { instanceType: 'c5d.xlarge' },
  { instanceType: 'c6g.xlarge' },
  { instanceType: 'c6i.xlarge' },
  { instanceType: 'c6in.xlarge' },
  { instanceType: 'c5n.xlarge' },
  { instanceType: 'g4dn.xlarge' },
  { instanceType: 'm5.xlarge' },
  { instanceType: 'm5d.xlarge' },
  { instanceType: 'm6g.xlarge' },
  { instanceType: 'm6gd.xlarge' },
  { instanceType: 'm6i.xlarge' },
  { instanceType: 't3.xlarge' },
  { instanceType: 't4g.xlarge' },
  { instanceType: 'd2.xlarge' },
  { instanceType: 'i3.xlarge' },
  { instanceType: 'i3en.xlarge' },
  { instanceType: 'i4i.xlarge' },
  { instanceType: 'r5.xlarge' },
  { instanceType: 'r5d.xlarge' },
  { instanceType: 'r5dn.xlarge' },
  { instanceType: 'r5n.xlarge' },
  { instanceType: 'r6g.xlarge' },
  { instanceType: 'r6i.xlarge' },
  { instanceType: 'x1e.xlarge' },
  { instanceType: 'x2iedn.xlarge' },
  { instanceType: 'c5.2xlarge' },
  { instanceType: 'c5a.2xlarge' },
  { instanceType: 'c5ad.2xlarge' },
  { instanceType: 'c5d.2xlarge' },
  { instanceType: 'c6g.2xlarge' },
  { instanceType: 'c6i.2xlarge' },
  { instanceType: 'c6in.2xlarge' },
  { instanceType: 'c5n.2xlarge' },
  { instanceType: 'g4dn.2xlarge' },
  { instanceType: 'm5.2xlarge' },
  { instanceType: 'm5d.2xlarge' },
  { instanceType: 'm6g.2xlarge' },
  { instanceType: 'm6gd.2xlarge' },
  { instanceType: 'm6i.2xlarge' },
  { instanceType: 't3.2xlarge' },
  { instanceType: 't4g.2xlarge' },
  { instanceType: 'd2.2xlarge' },
  { instanceType: 'i3.2xlarge' },
  { instanceType: 'i3en.2xlarge' },
  { instanceType: 'i4i.2xlarge' },
  { instanceType: 'r5.2xlarge' },
  { instanceType: 'r5d.2xlarge' },
  { instanceType: 'r5dn.2xlarge' },
  { instanceType: 'r5n.2xlarge' },
  { instanceType: 'r6g.2xlarge' },
  { instanceType: 'r6i.2xlarge' },
  { instanceType: 'x1e.2xlarge' },
  { instanceType: 'x2iedn.2xlarge' },
  { instanceType: 'i3en.3xlarge' },
  { instanceType: 'c5.4xlarge' },
  { instanceType: 'c5a.4xlarge' },
  { instanceType: 'c5ad.4xlarge' },
  { instanceType: 'c5d.4xlarge' },
  { instanceType: 'c6g.4xlarge' },
  { instanceType: 'c6i.4xlarge' },
  { instanceType: 'c6in.4xlarge' },
  { instanceType: 'c5n.4xlarge' },
  { instanceType: 'g4dn.4xlarge' },
  { instanceType: 'm5.4xlarge' },
  { instanceType: 'm5d.4xlarge' },
  { instanceType: 'm6g.4xlarge' },
  { instanceType: 'm6gd.4xlarge' },
  { instanceType: 'm6i.4xlarge' },
  { instanceType: 'd2.4xlarge' },
  { instanceType: 'i3.4xlarge' },
  { instanceType: 'i4i.4xlarge' },
  { instanceType: 'r5.4xlarge' },
  { instanceType: 'r5d.4xlarge' },
  { instanceType: 'r5dn.4xlarge' },
  { instanceType: 'r5n.4xlarge' },
  { instanceType: 'r6g.4xlarge' },
  { instanceType: 'r6i.4xlarge' },
  { instanceType: 'x1e.4xlarge' },
  { instanceType: 'x2iedn.4xlarge' },
  { instanceType: 'i3en.6xlarge' },
  { instanceType: 'c5a.8xlarge' },
  { instanceType: 'c5ad.8xlarge' },
  { instanceType: 'c6g.8xlarge' },
  { instanceType: 'c6i.8xlarge' },
  { instanceType: 'c6in.8xlarge' },
  { instanceType: 'g4dn.8xlarge' },
  { instanceType: 'm5.8xlarge' },
  { instanceType: 'm5d.8xlarge' },
  { instanceType: 'm6g.8xlarge' },
  { instanceType: 'm6gd.8xlarge' },
  { instanceType: 'm6i.8xlarge' },
  { instanceType: 'i3.8xlarge' },
  { instanceType: 'i4i.8xlarge' },
  { instanceType: 'r5.8xlarge' },
  { instanceType: 'r5d.8xlarge' },
  { instanceType: 'r5dn.8xlarge' },
  { instanceType: 'r5n.8xlarge' },
  { instanceType: 'r6g.8xlarge' },
  { instanceType: 'r6i.8xlarge' },
  { instanceType: 'x1e.8xlarge' },
  { instanceType: 'x2iedn.8xlarge' },
  { instanceType: 'c5.9xlarge' },
  { instanceType: 'c5d.9xlarge' },
  { instanceType: 'c5n.9xlarge' },
  { instanceType: 'd2.8xlarge' },
  { instanceType: 'c5.12xlarge' },
  { instanceType: 'c5a.12xlarge' },
  { instanceType: 'c5ad.12xlarge' },
  { instanceType: 'c5d.12xlarge' },
  { instanceType: 'c6g.12xlarge' },
  { instanceType: 'c6i.12xlarge' },
  { instanceType: 'c6in.12xlarge' },
  { instanceType: 'g4dn.12xlarge' },
  { instanceType: 'm5.12xlarge' },
  { instanceType: 'm5d.12xlarge' },
  { instanceType: 'm6g.12xlarge' },
  { instanceType: 'm6gd.12xlarge' },
  { instanceType: 'm6i.12xlarge' },
  { instanceType: 'i3en.12xlarge' },
  { instanceType: 'i4i.12xlarge' },
  { instanceType: 'r5.12xlarge' },
  { instanceType: 'r5d.12xlarge' },
  { instanceType: 'r5dn.12xlarge' },
  { instanceType: 'r5n.12xlarge' },
  { instanceType: 'r6g.12xlarge' },
  { instanceType: 'r6i.12xlarge' },
  { instanceType: 'c5a.16xlarge' },
  { instanceType: 'c5ad.16xlarge' },
  { instanceType: 'c6g.16xlarge' },
  { instanceType: 'c6g.metal' },
  { instanceType: 'c6i.16xlarge' },
  { instanceType: 'c6in.16xlarge' },
  { instanceType: 'g4dn.16xlarge' },
  { instanceType: 'm5.16xlarge' },
  { instanceType: 'm5d.16xlarge' },
  { instanceType: 'm6g.16xlarge' },
  { instanceType: 'm6g.metal' },
  { instanceType: 'm6gd.16xlarge' },
  { instanceType: 'm6gd.metal' },
  { instanceType: 'm6i.16xlarge' },
  { instanceType: 'i3.16xlarge' },
  { instanceType: 'i4i.16xlarge' },
  { instanceType: 'r5.16xlarge' },
  { instanceType: 'r5d.16xlarge' },
  { instanceType: 'r5dn.16xlarge' },
  { instanceType: 'r5n.16xlarge' },
  { instanceType: 'r6g.16xlarge' },
  { instanceType: 'r6g.metal' },
  { instanceType: 'r6i.16xlarge' },
  { instanceType: 'x1.16xlarge' },
  { instanceType: 'x2idn.16xlarge' },
  { instanceType: 'x1e.16xlarge' },
  { instanceType: 'x2iedn.16xlarge' },
  { instanceType: 'c5.18xlarge' },
  { instanceType: 'c5d.18xlarge' },
  { instanceType: 'c5n.18xlarge' },
  { instanceType: 'c5n.metal' },
  { instanceType: 'i3.metal' },
  { instanceType: 'c5.24xlarge' },
  { instanceType: 'c5.metal' },
  { instanceType: 'c5a.24xlarge' },
  { instanceType: 'c5ad.24xlarge' },
  { instanceType: 'c5d.24xlarge' },
  { instanceType: 'c5d.metal' },
  { instanceType: 'c6i.24xlarge' },
  { instanceType: 'c6in.24xlarge' },
  { instanceType: 'inf1.24xlarge' },
  { instanceType: 'g4dn.metal' },
  { instanceType: 'm5.24xlarge' },
  { instanceType: 'm5.metal' },
  { instanceType: 'm5d.24xlarge' },
  { instanceType: 'm5d.metal' },
  { instanceType: 'm6i.24xlarge' },
  { instanceType: 'i3en.24xlarge' },
  { instanceType: 'i3en.metal' },
  { instanceType: 'i4i.24xlarge' },
  { instanceType: 'r5.24xlarge' },
  { instanceType: 'r5.metal' },
  { instanceType: 'r5d.24xlarge' },
  { instanceType: 'r5d.metal' },
  { instanceType: 'r5dn.24xlarge' },
  { instanceType: 'r5dn.metal' },
  { instanceType: 'r5n.24xlarge' },
  { instanceType: 'r5n.metal' },
  { instanceType: 'r6i.24xlarge' },
  { instanceType: 'x2idn.24xlarge' },
  { instanceType: 'x2iedn.24xlarge' },
  { instanceType: 'c6i.32xlarge' },
  { instanceType: 'c6i.metal' },
  { instanceType: 'c6in.32xlarge' },
  { instanceType: 'c6in.metal' },
  { instanceType: 'm6i.32xlarge' },
  { instanceType: 'm6i.metal' },
  { instanceType: 'i4i.32xlarge' },
  { instanceType: 'i4i.metal' },
  { instanceType: 'r6i.32xlarge' },
  { instanceType: 'r6i.metal' },
  { instanceType: 'x1.32xlarge' },
  { instanceType: 'x2idn.32xlarge' },
  { instanceType: 'x2idn.metal' },
  { instanceType: 'x1e.32xlarge' },
  { instanceType: 'x2iedn.32xlarge' },
  { instanceType: 'x2iedn.metal' },
  { instanceType: 'u-12tb1.112xlarge' },
  { instanceType: 't2.nano' },
  { instanceType: 't1.micro' },
  { instanceType: 't2.micro' },
  { instanceType: 'm1.small' },
  { instanceType: 'a1.medium' },
  { instanceType: 'c6gd.medium' },
  { instanceType: 'c6gn.medium' },
  { instanceType: 'c7a.medium' },
  { instanceType: 'c7g.medium' },
  { instanceType: 'c7gd.medium' },
  { instanceType: 'c7gn.medium' },
  { instanceType: 't2.small' },
  { instanceType: 'm1.medium' },
  { instanceType: 'm3.medium' },
  { instanceType: 'm7a.medium' },
  { instanceType: 'm7g.medium' },
  { instanceType: 'm7gd.medium' },
  { instanceType: 'is4gen.medium' },
  { instanceType: 'r6gd.medium' },
  { instanceType: 'r7a.medium' },
  { instanceType: 'r7g.medium' },
  { instanceType: 'r7gd.medium' },
  { instanceType: 't3a.nano' },
  { instanceType: 't3a.micro' },
  { instanceType: 'c1.medium' },
  { instanceType: 't3a.small' },
  { instanceType: 'c3.large' },
  { instanceType: 'c4.large' },
  { instanceType: 'a1.large' },
  { instanceType: 'c6a.large' },
  { instanceType: 'c6gd.large' },
  { instanceType: 'c6gn.large' },
  { instanceType: 'c6id.large' },
  { instanceType: 'c7a.large' },
  { instanceType: 'c7g.large' },
  { instanceType: 'c7gd.large' },
  { instanceType: 'c7gn.large' },
  { instanceType: 'c7i-flex.large' },
  { instanceType: 'c7i.large' },
  { instanceType: 't2.medium' },
  { instanceType: 't3a.medium' },
  { instanceType: 'm1.large' },
  { instanceType: 'm3.large' },
  { instanceType: 'im4gn.large' },
  { instanceType: 'm4.large' },
  { instanceType: 'm5a.large' },
  { instanceType: 'm5ad.large' },
  { instanceType: 'm5dn.large' },
  { instanceType: 'm5n.large' },
  { instanceType: 'm5zn.large' },
  { instanceType: 'm6a.large' },
  { instanceType: 'm6id.large' },
  { instanceType: 'm6idn.large' },
  { instanceType: 'm6in.large' },
  { instanceType: 'm7a.large' },
  { instanceType: 'm7g.large' },
  { instanceType: 'm7gd.large' },
  { instanceType: 'm7i-flex.large' },
  { instanceType: 'm7i.large' },
  { instanceType: 't2.large' },
  { instanceType: 't3a.large' },
  { instanceType: 'is4gen.large' },
  { instanceType: 'r3.large' },
  { instanceType: 'r4.large' },
  { instanceType: 'i4g.large' },
  { instanceType: 'r5a.large' },
  { instanceType: 'r5ad.large' },
  { instanceType: 'r5b.large' },
  { instanceType: 'r6a.large' },
  { instanceType: 'r6gd.large' },
  { instanceType: 'r6id.large' },
  { instanceType: 'r6idn.large' },
  { instanceType: 'r6in.large' },
  { instanceType: 'r7a.large' },
  { instanceType: 'r7g.large' },
  { instanceType: 'r7gd.large' },
  { instanceType: 'r7i.large' },
  { instanceType: 'r7iz.large' },
  { instanceType: 'z1d.large' },
  { instanceType: 'm2.xlarge' },
  { instanceType: 'c3.xlarge' },
  { instanceType: 'c4.xlarge' },
  { instanceType: 'a1.xlarge' },
  { instanceType: 'c6a.xlarge' },
  { instanceType: 'c6gd.xlarge' },
  { instanceType: 'c6gn.xlarge' },
  { instanceType: 'c6id.xlarge' },
  { instanceType: 'c7a.xlarge' },
  { instanceType: 'c7g.xlarge' },
  { instanceType: 'c7gd.xlarge' },
  { instanceType: 'c7gn.xlarge' },
  { instanceType: 'c7i-flex.xlarge' },
  { instanceType: 'c7i.xlarge' },
  { instanceType: 'g5g.xlarge' },
  { instanceType: 'inf1.xlarge' },
  { instanceType: 'm1.xlarge' },
  { instanceType: 'm3.xlarge' },
  { instanceType: 'd3en.xlarge' },
  { instanceType: 'g4ad.xlarge' },
  { instanceType: 'g5.xlarge' },
  { instanceType: 'g6.xlarge' },
  { instanceType: 'im4gn.xlarge' },
  { instanceType: 'inf2.xlarge' },
  { instanceType: 'm4.xlarge' },
  { instanceType: 'm5a.xlarge' },
  { instanceType: 'm5ad.xlarge' },
  { instanceType: 'm5dn.xlarge' },
  { instanceType: 'm5n.xlarge' },
  { instanceType: 'm5zn.xlarge' },
  { instanceType: 'm6a.xlarge' },
  { instanceType: 'm6id.xlarge' },
  { instanceType: 'm6idn.xlarge' },
  { instanceType: 'm6in.xlarge' },
  { instanceType: 'm7a.xlarge' },
  { instanceType: 'm7g.xlarge' },
  { instanceType: 'm7gd.xlarge' },
  { instanceType: 'm7i-flex.xlarge' },
  { instanceType: 'm7i.xlarge' },
  { instanceType: 't2.xlarge' },
  { instanceType: 't3a.xlarge' },
  { instanceType: 'is4gen.xlarge' },
  { instanceType: 'g3s.xlarge' },
  { instanceType: 'i2.xlarge' },
  { instanceType: 'r3.xlarge' },
  { instanceType: 'r4.xlarge' },
  { instanceType: 'd3.xlarge' },
  { instanceType: 'i4g.xlarge' },
  { instanceType: 'r5a.xlarge' },
  { instanceType: 'r5ad.xlarge' },
  { instanceType: 'r5b.xlarge' },
  { instanceType: 'r6a.xlarge' },
  { instanceType: 'r6gd.xlarge' },
  { instanceType: 'r6id.xlarge' },
  { instanceType: 'r6idn.xlarge' },
  { instanceType: 'r6in.xlarge' },
  { instanceType: 'r7a.xlarge' },
  { instanceType: 'r7g.xlarge' },
  { instanceType: 'r7gd.xlarge' },
  { instanceType: 'r7i.xlarge' },
  { instanceType: 'r7iz.xlarge' },
  { instanceType: 'z1d.xlarge' },
  { instanceType: 'm2.2xlarge' },
  { instanceType: 'p2.xlarge' },
  { instanceType: 'c1.xlarge' },
  { instanceType: 'c3.2xlarge' },
  { instanceType: 'c4.2xlarge' },
  { instanceType: 'a1.2xlarge' },
  { instanceType: 'c6a.2xlarge' },
  { instanceType: 'c6gd.2xlarge' },
  { instanceType: 'c6gn.2xlarge' },
  { instanceType: 'c6id.2xlarge' },
  { instanceType: 'c7a.2xlarge' },
  { instanceType: 'c7g.2xlarge' },
  { instanceType: 'c7gd.2xlarge' },
  { instanceType: 'c7gn.2xlarge' },
  { instanceType: 'c7i-flex.2xlarge' },
  { instanceType: 'c7i.2xlarge' },
  { instanceType: 'g5g.2xlarge' },
  { instanceType: 'inf1.2xlarge' },
  { instanceType: 'mac2.metal' },
  { instanceType: 'mac2-m2.metal' },
  { instanceType: 'm3.2xlarge' },
  { instanceType: 'd3en.2xlarge' },
  { instanceType: 'g4ad.2xlarge' },
  { instanceType: 'g5.2xlarge' },
  { instanceType: 'g6.2xlarge' },
  { instanceType: 'im4gn.2xlarge' },
  { instanceType: 'm4.2xlarge' },
  { instanceType: 'm5a.2xlarge' },
  { instanceType: 'm5ad.2xlarge' },
  { instanceType: 'm5dn.2xlarge' },
  { instanceType: 'm5n.2xlarge' },
  { instanceType: 'm5zn.2xlarge' },
  { instanceType: 'm6a.2xlarge' },
  { instanceType: 'm6id.2xlarge' },
  { instanceType: 'm6idn.2xlarge' },
  { instanceType: 'm6in.2xlarge' },
  { instanceType: 'm7a.2xlarge' },
  { instanceType: 'm7g.2xlarge' },
  { instanceType: 'm7gd.2xlarge' },
  { instanceType: 'm7i-flex.2xlarge' },
  { instanceType: 'm7i.2xlarge' },
  { instanceType: 't2.2xlarge' },
  { instanceType: 't3a.2xlarge' },
  { instanceType: 'is4gen.2xlarge' },
  { instanceType: 'i2.2xlarge' },
  { instanceType: 'p3.2xlarge' },
  { instanceType: 'r3.2xlarge' },
  { instanceType: 'r4.2xlarge' },
  { instanceType: 'd3.2xlarge' },
  { instanceType: 'i4g.2xlarge' },
  { instanceType: 'r5a.2xlarge' },
  { instanceType: 'r5ad.2xlarge' },
  { instanceType: 'r5b.2xlarge' },
  { instanceType: 'r6a.2xlarge' },
  { instanceType: 'r6gd.2xlarge' },
  { instanceType: 'r6id.2xlarge' },
  { instanceType: 'r6idn.2xlarge' },
  { instanceType: 'r6in.2xlarge' },
  { instanceType: 'r7a.2xlarge' },
  { instanceType: 'r7g.2xlarge' },
  { instanceType: 'r7gd.2xlarge' },
  { instanceType: 'r7i.2xlarge' },
  { instanceType: 'r7iz.2xlarge' },
  { instanceType: 'z1d.2xlarge' },
  { instanceType: 'm2.4xlarge' },
  { instanceType: 'f1.2xlarge' },
  { instanceType: 'x2iezn.2xlarge' },
  { instanceType: 'vt1.3xlarge' },
  { instanceType: 'mac1.metal' },
  { instanceType: 'mac2-m2pro.metal' },
  { instanceType: 'm5zn.3xlarge' },
  { instanceType: 'z1d.3xlarge' },
  { instanceType: 'c3.4xlarge' },
  { instanceType: 'c4.4xlarge' },
  { instanceType: 'a1.4xlarge' },
  { instanceType: 'a1.metal' },
  { instanceType: 'c6a.4xlarge' },
  { instanceType: 'c6gd.4xlarge' },
  { instanceType: 'c6gn.4xlarge' },
  { instanceType: 'c6id.4xlarge' },
  { instanceType: 'c7a.4xlarge' },
  { instanceType: 'c7g.4xlarge' },
  { instanceType: 'c7gd.4xlarge' },
  { instanceType: 'c7gn.4xlarge' },
  { instanceType: 'c7i-flex.4xlarge' },
  { instanceType: 'c7i.4xlarge' },
  { instanceType: 'g5g.4xlarge' },
  { instanceType: 'd3en.4xlarge' },
  { instanceType: 'g4ad.4xlarge' },
  { instanceType: 'g5.4xlarge' },
  { instanceType: 'g6.4xlarge' },
  { instanceType: 'im4gn.4xlarge' },
  { instanceType: 'm4.4xlarge' },
  { instanceType: 'm5a.4xlarge' },
  { instanceType: 'm5ad.4xlarge' },
  { instanceType: 'm5dn.4xlarge' },
  { instanceType: 'm5n.4xlarge' },
  { instanceType: 'm6a.4xlarge' },
  { instanceType: 'm6id.4xlarge' },
  { instanceType: 'm6idn.4xlarge' },
  { instanceType: 'm6in.4xlarge' },
  { instanceType: 'm7a.4xlarge' },
  { instanceType: 'm7g.4xlarge' },
  { instanceType: 'm7gd.4xlarge' },
  { instanceType: 'm7i-flex.4xlarge' },
  { instanceType: 'm7i.4xlarge' },
  { instanceType: 'is4gen.4xlarge' },
  { instanceType: 'g3.4xlarge' },
  { instanceType: 'i2.4xlarge' },
  { instanceType: 'r3.4xlarge' },
  { instanceType: 'r4.4xlarge' },
  { instanceType: 'd3.4xlarge' },
  { instanceType: 'gr6.4xlarge' },
  { instanceType: 'hpc7g.4xlarge' },
  { instanceType: 'i4g.4xlarge' },
  { instanceType: 'r5a.4xlarge' },
  { instanceType: 'r5ad.4xlarge' },
  { instanceType: 'r5b.4xlarge' },
  { instanceType: 'r6a.4xlarge' },
  { instanceType: 'r6gd.4xlarge' },
  { instanceType: 'r6id.4xlarge' },
  { instanceType: 'r6idn.4xlarge' },
  { instanceType: 'r6in.4xlarge' },
  { instanceType: 'r7a.4xlarge' },
  { instanceType: 'r7g.4xlarge' },
  { instanceType: 'r7gd.4xlarge' },
  { instanceType: 'r7i.4xlarge' },
  { instanceType: 'r7iz.4xlarge' },
  { instanceType: 'f1.4xlarge' },
  { instanceType: 'x2iezn.4xlarge' },
  { instanceType: 'inf1.6xlarge' },
  { instanceType: 'vt1.6xlarge' },
  { instanceType: 'd3en.6xlarge' },
  { instanceType: 'm5zn.6xlarge' },
  { instanceType: 'z1d.6xlarge' },
  { instanceType: 'x2iezn.6xlarge' },
  { instanceType: 'c3.8xlarge' },
  { instanceType: 'c6a.8xlarge' },
  { instanceType: 'c6gd.8xlarge' },
  { instanceType: 'c6gn.8xlarge' },
  { instanceType: 'c6id.8xlarge' },
  { instanceType: 'c7a.8xlarge' },
  { instanceType: 'c7g.8xlarge' },
  { instanceType: 'c7gd.8xlarge' },
  { instanceType: 'c7gn.8xlarge' },
  { instanceType: 'c7i-flex.8xlarge' },
  { instanceType: 'c7i.8xlarge' },
  { instanceType: 'g5g.8xlarge' },
  { instanceType: 'd3en.8xlarge' },
  { instanceType: 'g4ad.8xlarge' },
  { instanceType: 'g5.8xlarge' },
  { instanceType: 'g6.8xlarge' },
  { instanceType: 'hpc7g.8xlarge' },
  { instanceType: 'im4gn.8xlarge' },
  { instanceType: 'inf2.8xlarge' },
  { instanceType: 'm5a.8xlarge' },
  { instanceType: 'm5ad.8xlarge' },
  { instanceType: 'm5dn.8xlarge' },
  { instanceType: 'm5n.8xlarge' },
  { instanceType: 'm6a.8xlarge' },
  { instanceType: 'm6id.8xlarge' },
  { instanceType: 'm6idn.8xlarge' },
  { instanceType: 'm6in.8xlarge' },
  { instanceType: 'm7a.8xlarge' },
  { instanceType: 'm7g.8xlarge' },
  { instanceType: 'm7gd.8xlarge' },
  { instanceType: 'm7i-flex.8xlarge' },
  { instanceType: 'm7i.8xlarge' },
  { instanceType: 'is4gen.8xlarge' },
  { instanceType: 'g3.8xlarge' },
  { instanceType: 'i2.8xlarge' },
  { instanceType: 'p3.8xlarge' },
  { instanceType: 'r3.8xlarge' },
  { instanceType: 'r4.8xlarge' },
  { instanceType: 'd3.8xlarge' },
  { instanceType: 'gr6.8xlarge' },
  { instanceType: 'i4g.8xlarge' },
  { instanceType: 'r5a.8xlarge' },
  { instanceType: 'r5ad.8xlarge' },
  { instanceType: 'r5b.8xlarge' },
  { instanceType: 'r6a.8xlarge' },
  { instanceType: 'r6gd.8xlarge' },
  { instanceType: 'r6id.8xlarge' },
  { instanceType: 'r6idn.8xlarge' },
  { instanceType: 'r6in.8xlarge' },
  { instanceType: 'r7a.8xlarge' },
  { instanceType: 'r7g.8xlarge' },
  { instanceType: 'r7gd.8xlarge' },
  { instanceType: 'r7i.8xlarge' },
  { instanceType: 'r7iz.8xlarge' },
  { instanceType: 'p2.8xlarge' },
  { instanceType: 'x2iezn.8xlarge' },
  { instanceType: 'c4.8xlarge' },
  { instanceType: 'm4.10xlarge' },
  { instanceType: 'c6a.12xlarge' },
  { instanceType: 'c6gd.12xlarge' },
  { instanceType: 'c6gn.12xlarge' },
  { instanceType: 'c6id.12xlarge' },
  { instanceType: 'c7a.12xlarge' },
  { instanceType: 'c7g.12xlarge' },
  { instanceType: 'c7gd.12xlarge' },
  { instanceType: 'c7gn.12xlarge' },
  { instanceType: 'c7i.12xlarge' },
  { instanceType: 'd3en.12xlarge' },
  { instanceType: 'g5.12xlarge' },
  { instanceType: 'g6.12xlarge' },
  { instanceType: 'm5a.12xlarge' },
  { instanceType: 'm5ad.12xlarge' },
  { instanceType: 'm5dn.12xlarge' },
  { instanceType: 'm5n.12xlarge' },
  { instanceType: 'm5zn.12xlarge' },
  { instanceType: 'm5zn.metal' },
  { instanceType: 'm6a.12xlarge' },
  { instanceType: 'm6id.12xlarge' },
  { instanceType: 'm6idn.12xlarge' },
  { instanceType: 'm6in.12xlarge' },
  { instanceType: 'm7a.12xlarge' },
  { instanceType: 'm7g.12xlarge' },
  { instanceType: 'm7gd.12xlarge' },
  { instanceType: 'm7i.12xlarge' },
  { instanceType: 'r5a.12xlarge' },
  { instanceType: 'r5ad.12xlarge' },
  { instanceType: 'r5b.12xlarge' },
  { instanceType: 'r6a.12xlarge' },
  { instanceType: 'r6gd.12xlarge' },
  { instanceType: 'r6id.12xlarge' },
  { instanceType: 'r6idn.12xlarge' },
  { instanceType: 'r6in.12xlarge' },
  { instanceType: 'r7a.12xlarge' },
  { instanceType: 'r7g.12xlarge' },
  { instanceType: 'r7gd.12xlarge' },
  { instanceType: 'r7i.12xlarge' },
  { instanceType: 'r7iz.12xlarge' },
  { instanceType: 'z1d.12xlarge' },
  { instanceType: 'z1d.metal' },
  { instanceType: 'x2iezn.12xlarge' },
  { instanceType: 'x2iezn.metal' },
  { instanceType: 'c6a.16xlarge' },
  { instanceType: 'c6gd.16xlarge' },
  { instanceType: 'c6gd.metal' },
  { instanceType: 'c6gn.16xlarge' },
  { instanceType: 'c6id.16xlarge' },
  { instanceType: 'c7a.16xlarge' },
  { instanceType: 'c7g.16xlarge' },
  { instanceType: 'c7g.metal' },
  { instanceType: 'c7gd.16xlarge' },
  { instanceType: 'c7gd.metal' },
  { instanceType: 'c7gn.16xlarge' },
  { instanceType: 'c7gn.metal' },
  { instanceType: 'c7i.16xlarge' },
  { instanceType: 'g5g.16xlarge' },
  { instanceType: 'g5g.metal' },
  { instanceType: 'hpc7g.16xlarge' },
  { instanceType: 'g4ad.16xlarge' },
  { instanceType: 'g5.16xlarge' },
  { instanceType: 'g6.16xlarge' },
  { instanceType: 'im4gn.16xlarge' },
  { instanceType: 'm4.16xlarge' },
  { instanceType: 'm5a.16xlarge' },
  { instanceType: 'm5ad.16xlarge' },
  { instanceType: 'm5dn.16xlarge' },
  { instanceType: 'm5n.16xlarge' },
  { instanceType: 'm6a.16xlarge' },
  { instanceType: 'm6id.16xlarge' },
  { instanceType: 'm6idn.16xlarge' },
  { instanceType: 'm6in.16xlarge' },
  { instanceType: 'm7a.16xlarge' },
  { instanceType: 'm7g.16xlarge' },
  { instanceType: 'm7g.metal' },
  { instanceType: 'm7gd.16xlarge' },
  { instanceType: 'm7gd.metal' },
  { instanceType: 'm7i.16xlarge' },
  { instanceType: 'g3.16xlarge' },
  { instanceType: 'p3.16xlarge' },
  { instanceType: 'r4.16xlarge' },
  { instanceType: 'i4g.16xlarge' },
  { instanceType: 'r5a.16xlarge' },
  { instanceType: 'r5ad.16xlarge' },
  { instanceType: 'r5b.16xlarge' },
  { instanceType: 'r6a.16xlarge' },
  { instanceType: 'r6gd.16xlarge' },
  { instanceType: 'r6gd.metal' },
  { instanceType: 'r6id.16xlarge' },
  { instanceType: 'r6idn.16xlarge' },
  { instanceType: 'r6in.16xlarge' },
  { instanceType: 'r7a.16xlarge' },
  { instanceType: 'r7g.16xlarge' },
  { instanceType: 'r7g.metal' },
  { instanceType: 'r7gd.16xlarge' },
  { instanceType: 'r7gd.metal' },
  { instanceType: 'r7i.16xlarge' },
  { instanceType: 'r7iz.16xlarge' },
  { instanceType: 'r7iz.metal-16xl' },
  { instanceType: 'p2.16xlarge' },
  { instanceType: 'f1.16xlarge' },
  { instanceType: 'c6a.24xlarge' },
  { instanceType: 'c6id.24xlarge' },
  { instanceType: 'c7a.24xlarge' },
  { instanceType: 'c7i.24xlarge' },
  { instanceType: 'c7i.metal-24xl' },
  { instanceType: 'vt1.24xlarge' },
  { instanceType: 'g5.24xlarge' },
  { instanceType: 'g6.24xlarge' },
  { instanceType: 'inf2.24xlarge' },
  { instanceType: 'm5a.24xlarge' },
  { instanceType: 'm5ad.24xlarge' },
  { instanceType: 'm5dn.24xlarge' },
  { instanceType: 'm5dn.metal' },
  { instanceType: 'm5n.24xlarge' },
  { instanceType: 'm5n.metal' },
  { instanceType: 'm6a.24xlarge' },
  { instanceType: 'm6id.24xlarge' },
  { instanceType: 'm6idn.24xlarge' },
  { instanceType: 'm6in.24xlarge' },
  { instanceType: 'm7a.24xlarge' },
  { instanceType: 'm7i.24xlarge' },
  { instanceType: 'm7i.metal-24xl' },
  { instanceType: 'p3dn.24xlarge' },
  { instanceType: 'r5a.24xlarge' },
  { instanceType: 'r5ad.24xlarge' },
  { instanceType: 'r5b.24xlarge' },
  { instanceType: 'r5b.metal' },
  { instanceType: 'r6a.24xlarge' },
  { instanceType: 'r6id.24xlarge' },
  { instanceType: 'r6idn.24xlarge' },
  { instanceType: 'r6in.24xlarge' },
  { instanceType: 'r7a.24xlarge' },
  { instanceType: 'r7i.24xlarge' },
  { instanceType: 'r7i.metal-24xl' },
  { instanceType: 'p4d.24xlarge' },
  { instanceType: 'c6a.32xlarge' },
  { instanceType: 'c6id.32xlarge' },
  { instanceType: 'c6id.metal' },
  { instanceType: 'c7a.32xlarge' },
  { instanceType: 'm6a.32xlarge' },
  { instanceType: 'm6id.32xlarge' },
  { instanceType: 'm6id.metal' },
  { instanceType: 'm6idn.32xlarge' },
  { instanceType: 'm6idn.metal' },
  { instanceType: 'm6in.32xlarge' },
  { instanceType: 'm6in.metal' },
  { instanceType: 'm7a.32xlarge' },
  { instanceType: 'r6a.32xlarge' },
  { instanceType: 'r6id.32xlarge' },
  { instanceType: 'r6id.metal' },
  { instanceType: 'r6idn.32xlarge' },
  { instanceType: 'r6idn.metal' },
  { instanceType: 'r6in.32xlarge' },
  { instanceType: 'r6in.metal' },
  { instanceType: 'r7a.32xlarge' },
  { instanceType: 'r7iz.32xlarge' },
  { instanceType: 'r7iz.metal-32xl' },
  { instanceType: 'c6a.48xlarge' },
  { instanceType: 'c6a.metal' },
  { instanceType: 'c7a.48xlarge' },
  { instanceType: 'c7a.metal-48xl' },
  { instanceType: 'c7i.48xlarge' },
  { instanceType: 'c7i.metal-48xl' },
  { instanceType: 'g5.48xlarge' },
  { instanceType: 'g6.48xlarge' },
  { instanceType: 'inf2.48xlarge' },
  { instanceType: 'm6a.48xlarge' },
  { instanceType: 'm6a.metal' },
  { instanceType: 'm7a.48xlarge' },
  { instanceType: 'm7a.metal-48xl' },
  { instanceType: 'm7i.48xlarge' },
  { instanceType: 'm7i.metal-48xl' },
  { instanceType: 'r6a.48xlarge' },
  { instanceType: 'r6a.metal' },
  { instanceType: 'r7a.48xlarge' },
  { instanceType: 'r7a.metal-48xl' },
  { instanceType: 'r7i.48xlarge' },
  { instanceType: 'r7i.metal-48xl' },
  { instanceType: 'p5.48xlarge' },
  { instanceType: 'u-3tb1.56xlarge' },
  { instanceType: 'u-6tb1.56xlarge' },
  { instanceType: 'u-6tb1.112xlarge' },
  { instanceType: 'u-9tb1.112xlarge' },
  { instanceType: 'u-24tb1.112xlarge' },
  { instanceType: 'u7in-16tb.224xlarge' },
  { instanceType: 'c8g.medium' },
  { instanceType: 'm8g.medium' },
  { instanceType: 'r8g.medium' },
  { instanceType: 'x2gd.medium' },
  { instanceType: 'x8g.medium' },
  { instanceType: 'c8g.large' },
  { instanceType: 'm8g.large' },
  { instanceType: 'r8g.large' },
  { instanceType: 'x2gd.large' },
  { instanceType: 'x8g.large' },
  { instanceType: 'c8g.xlarge' },
  { instanceType: 'm8g.xlarge' },
  { instanceType: 'r8g.xlarge' },
  { instanceType: 'x2gd.xlarge' },
  { instanceType: 'x8g.xlarge' },
  { instanceType: 'c8g.2xlarge' },
  { instanceType: 'h1.2xlarge' },
  { instanceType: 'm8g.2xlarge' },
  { instanceType: 'r8g.2xlarge' },
  { instanceType: 'x2gd.2xlarge' },
  { instanceType: 'x8g.2xlarge' },
  { instanceType: 'c8g.4xlarge' },
  { instanceType: 'h1.4xlarge' },
  { instanceType: 'm8g.4xlarge' },
  { instanceType: 'r8g.4xlarge' },
  { instanceType: 'x2gd.4xlarge' },
  { instanceType: 'x8g.4xlarge' },
  { instanceType: 'c8g.8xlarge' },
  { instanceType: 'h1.8xlarge' },
  { instanceType: 'm8g.8xlarge' },
  { instanceType: 'r8g.8xlarge' },
  { instanceType: 'x2gd.8xlarge' },
  { instanceType: 'x8g.8xlarge' },
  { instanceType: 'c8g.12xlarge' },
  { instanceType: 'm8g.12xlarge' },
  { instanceType: 'r8g.12xlarge' },
  { instanceType: 'x2gd.12xlarge' },
  { instanceType: 'x8g.12xlarge' },
  { instanceType: 'c8g.16xlarge' },
  { instanceType: 'h1.16xlarge' },
  { instanceType: 'm8g.16xlarge' },
  { instanceType: 'r8g.16xlarge' },
  { instanceType: 'x2gd.16xlarge' },
  { instanceType: 'x2gd.metal' },
  { instanceType: 'x8g.16xlarge' },
  { instanceType: 'c8g.24xlarge' },
  { instanceType: 'c8g.metal-24xl' },
  { instanceType: 'm8g.24xlarge' },
  { instanceType: 'm8g.metal-24xl' },
  { instanceType: 'r8g.24xlarge' },
  { instanceType: 'r8g.metal-24xl' },
  { instanceType: 'x8g.24xlarge' },
  { instanceType: 'x8g.metal-24xl' },
  { instanceType: 'c8g.48xlarge' },
  { instanceType: 'c8g.metal-48xl' },
  { instanceType: 'm8g.48xlarge' },
  { instanceType: 'm8g.metal-48xl' },
  { instanceType: 'r8g.48xlarge' },
  { instanceType: 'r8g.metal-48xl' },
  { instanceType: 'x8g.48xlarge' },
  { instanceType: 'x8g.metal-48xl' },
  { instanceType: 'u-18tb1.112xlarge' },
  { instanceType: 'g6e.xlarge' },
  { instanceType: 'trn1.2xlarge' },
  { instanceType: 'g6e.2xlarge' },
  { instanceType: 'g6e.4xlarge' },
  { instanceType: 'mac2-m1ultra.metal' },
  { instanceType: 'g6e.8xlarge' },
  { instanceType: 'g6e.12xlarge' },
  { instanceType: 'g6e.16xlarge' },
  { instanceType: 'dl1.24xlarge' },
  { instanceType: 'g6e.24xlarge' },
  { instanceType: 'trn1.32xlarge' },
  { instanceType: 'trn1n.32xlarge' },
  { instanceType: 'g6e.48xlarge' },
  { instanceType: 'u7i-12tb.224xlarge' },
  { instanceType: 'u7in-24tb.224xlarge' },
  { instanceType: 'u7in-32tb.224xlarge' },
]);

const rules = ref<IResourcePayload>(props.rules)

const $externalResults = reactive({})
const v$ = useVuelidate(rules.value, resourceData.value, {$externalResults})


const platformsOptions = ref<Array<IPlatform>>([])
const availableInPlatform = (platforms: Array<string>): boolean => {

  if (!platformsOptions.value) {
    return false
  }

  const to_uuid: Array<string> = []
  _.each(platformsOptions.value, (k) => {
    if (platforms.includes(k.title)) {
      to_uuid.push(k.uuid)
    }
  })
  return to_uuid.includes(resourceData.value.platform.uuid)
}
const getPlatforms = async () => {
  console.log(resourceStore)
  const p = await resourceStore.getPlatforms()
  console.log(p)
  platformsOptions.value = p
}
getPlatforms()


</script>
