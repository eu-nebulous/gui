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
            <option/>
            <option v-for="(platform, index) in resourceStore.platforms" :key="index" :value="platform.uuid">
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
                  :options="resourceStore.availableRegions['AWS']">
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
                  :options="resourceStore.availableInstanceTypes['AWS']">
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

        <div class="flex flex-col"
          v-if="availableInPlatform(['AZURE'])">
          <Label>Subscription ID</Label>
          <Input
              type="text"
              required
              v-model="resourceData.credentials.subscriptionId"
              :class="{
                'input--invalid': v$.credentials.subscriptionId && v$.credentials.subscriptionId.$error
              }"
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
  <Dialog.Footer>
      <Button type="button" variant="outline-secondary" @click="$emit('on-close')" class="w-20 mr-4"> Cancel </Button>
      <Button variant="primary" type="button" class="w-20" @click="confirmForm"> Save </Button>
  </Dialog.Footer>
</template>
<script setup lang="ts">
import {computed, onBeforeMount, onMounted, ref, watch} from "vue"
import {Dialog} from "@/base-components/Headless"
import Input from "../../base-components/Form/FormInput.vue";
import TextArea from "../../base-components/Form/FormTextarea.vue";
import Label from "../../base-components/Form/FormLabel.vue";
import Select from "../../base-components/Form/FormSelect.vue";
import _ from "lodash";
import {useResourceStore} from "@/store/modules/resources.ts";
import {IResourcePayload} from "@/types/resource.ts";
import {useVuelidate} from "@vuelidate/core";
import VueMultiselect from "vue-multiselect";
import {IRegion, IType} from "@/interfaces/resources.interface.ts";
import Button from "@/base-components/Button";
import {required} from "@vuelidate/validators";


const resourceStore = useResourceStore()

const $emit=defineEmits(['on-confirm','on-close'])
const props = defineProps(['resourceData', 'isEditing','externalResults']);
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

// HACK: https://github.com/vuelidate/vuelidate/issues/1147
const externalServerValidation = () => true

const rules = computed(() => {
  const r = {
    title: { required, externalServerValidation },
    platform: { required, externalServerValidation },
    credentials: {
      user: { required, externalServerValidation },
      secret: { required, externalServerValidation },
    }
  }

  // Check if the platform object and title exist before comparing
  if (resourceData.value.platform &&
      resourceData.value.platform.uuid &&
      resourceStore.platforms) {

    // Find the platform by UUID to get its title
    const selectedPlatform = resourceStore.platforms.find(
      platform => platform.uuid === resourceData.value.platform.uuid
    );

    if (selectedPlatform && selectedPlatform.title === 'AZURE') {
      // Add the subscriptionId validation for Azure
      r.credentials['subscriptionId'] = { required, externalServerValidation };
    }
  }

  return r;
})

const v$ = useVuelidate(rules, resourceData, props.externalResults)


const availableInPlatform = (platforms: Array<string>): boolean => {

  if (!resourceStore.platforms) {
    return false
  }

  const to_uuid: Array<string> = []
  _.each(resourceStore.platforms, (k) => {
    if (platforms.includes(k.title)) {
      to_uuid.push(k.uuid)
    }
  })
  return to_uuid.includes(resourceData.value.platform.uuid)
}

const formatFieldsForSubmission = () => {
  if (resourceData.value.platform && resourceData.value.platform.title === 'AWS') {
    // Format regions as a comma-separated string
    if (Array.isArray(resourceData.value.regions)) {
      resourceData.value.regions = resourceData.value.regions.map((region: IRegion) => region.region).join(',')
    }

    if (Array.isArray(resourceData.value.validInstanceTypes)) {
      resourceData.value.validInstanceTypes = resourceData.value.validInstanceTypes.map((instanceType: IType) => instanceType.instanceType).join(',')
    }
  }
}

const mapFieldsForDisplay = () => {
  if (resourceData.value.platform && resourceData.value.platform.title === 'AWS') {
    // Map regions from comma-separated string to array of region objects
    if (resourceData.value.regions && typeof resourceData.value.regions === 'string') {
      const regionIds = resourceData.value.regions.split(',')
      resourceData.value.regions = _.filter(resourceStore.availableRegions['AWS'], (region: IRegion) => regionIds.includes(region.region))
    }

    // Map validInstanceTypes from comma-separated string to array of instance types
    if (resourceData.value.validInstanceTypes && typeof resourceData.value.validInstanceTypes === 'string') {
      const validInstanceTypesIds = resourceData.value.validInstanceTypes.split(',')
      resourceData.value.validInstanceTypes = _.filter(resourceStore.availableInstanceTypes['AWS'], (instanceType: IType) => validInstanceTypesIds.includes(instanceType.instanceType)
      )
    }
  }
}


onBeforeMount(()=>{
  resourceStore.getPlatforms()
})

onMounted(() => {
  if(props.isEditing){
    mapFieldsForDisplay()
  }
})

// Add this after your existing code
watch(() => resourceData.value.platform.uuid, (newPlatformUuid) => {
  const selectedPlatform = resourceStore.platforms.find(
    platform => platform.uuid === newPlatformUuid
  );

  // If switching to a non-Azure platform, clear the subscriptionId
  if (selectedPlatform && selectedPlatform.title !== 'AZURE') {
    resourceData.value.credentials.subscriptionId = '';
  }

  // Force revalidation when platform changes
  v$.value.$reset();
});

const confirmForm = async () => {

  if (!(await v$.value.$validate())) {
    console.log("Failed validation", v$.value.$errors);
    return;
  }

  formatFieldsForSubmission()
  $emit('on-confirm')
}
</script>
