<template>
  <div class="flex flex-col text-start">
    <slot name="title"></slot>
    <Dialog.Description>
      <ResourceForm :resource-data="resourceData" :rules="rules"/>
    </Dialog.Description>
    <Dialog.Footer>
      <Button type="button" variant="outline-secondary" @click="closeModal(false)" class="w-20 mr-4"> Cancel </Button>
      <Button variant="primary" type="button" class="w-20" @click="createResource"> Create </Button>
    </Dialog.Footer>
  </div>
</template>

<script setup lang="ts">
import {reactive} from "vue"
import {useUIStore} from "@/store/modules/ui.ts"
import {useResourceStore} from "@/store/modules/resources.ts"
import {extractExternalResults} from "@/utils/helper.ts"
import {useVuelidate} from "@vuelidate/core"
import {required} from "@vuelidate/validators"
import {Dialog} from "@/base-components/Headless"
import Button from "@/base-components/Button"
import {SNACKBAR_MESSAGE_TYPES} from "@/constants"
import {IResourcePayload} from "@/types/resource.ts"
import ResourceForm from "@/components/Modal/ResourceForm.vue";
import {IPlatform} from "@/interfaces/platform.interface.ts";
import { IRegion } from "@/interfaces/resources.interface.ts"

const resourceStore = useResourceStore()
const uiStore = useUIStore()

const resourceData = reactive<IResourcePayload>({
  title: "",
  platform: {"uuid":'','title':''} as IPlatform,
  _platform: [{"uuid":'','title':''} as IPlatform], // TODO Remove this
  securityGroup:"",
  regions:"",
  subnet:"",
  endpoint:"",
  identityVersion:"",
  defaultNetwork:"",
  credentials: {
    user:"",
    secret:"",
    domain:"",
  },
  sshCredentials: {
    username:"",
    privateKey:"",
    keyPairName:"",
  }
})

// HACK: https://github.com/vuelidate/vuelidate/issues/1147
const externalServerValidation = () => true

const rules = {
  title: { required, externalServerValidation },
  platform: { required, externalServerValidation }
}

const $externalResults = reactive({})
const v$ = useVuelidate(rules, resourceData, { $externalResults })

const closeModal = (skipConfirmation: boolean = false) => {
  uiStore.setModalWindowState(null, skipConfirmation)
}


const createResource = async () => {
  // Map regions from objects to string (comma-separated region identifiers)
  if (Array.isArray(resourceData.regions)) {
    resourceData.regions = resourceData.regions.map((region: IRegion) => region.region).join(',');
  }

  if (!(await v$.value.$validate())) {
    console.log("Failed validation");
    return;
  }

  resourceStore
      .createResource(resourceData)
      .then((createdResource) => {
        closeModal(true);
        uiStore.setSnackbarMessage({
          message: `Successfully created resource ${createdResource.title}`,
          type: SNACKBAR_MESSAGE_TYPES.SUCCESS
        });
      })
      .catch((error) => {
        const errors = extractExternalResults(error);
        Object.assign($externalResults, errors);
      });
};


</script>
