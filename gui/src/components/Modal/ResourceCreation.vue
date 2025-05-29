<template>
  <div class="flex flex-col text-start">
    <slot name="title"></slot>
    <ResourceForm :resource-data="resourceData"
                  :externalResults="externalResults"
                  @on-confirm="createResource"
                  @on-close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue"
import {useUIStore} from "@/store/modules/ui.ts"
import {useResourceStore} from "@/store/modules/resources.ts"
import {extractExternalResults} from "@/utils/helper.ts"
import {SNACKBAR_MESSAGE_TYPES} from "@/constants"
import {IResourcePayload} from "@/types/resource.ts"
import ResourceForm from "@/components/Modal/ResourceForm.vue";
import {IPlatform} from "@/interfaces/platform.interface.ts";

const resourceStore = useResourceStore()
const uiStore = useUIStore()

const resourceData = reactive<IResourcePayload>({
  title: "",
  platform: {"uuid":'','title':''} as IPlatform,
  _platform: [{"uuid":'','title':''} as IPlatform], // TODO Remove this
  securityGroup:"",
  regions:"",
  validInstanceTypes: "",
  subnet:"",
  endpoint:"",
  scope:"project",
  project:"",
  identityVersion:"",
  defaultNetwork:"",
  credentials: {
    user:"",
    secret:"",
    domain:"",
    subscriptionId:"",
  },
  sshCredentials: {
    username:"",
    privateKey:"",
    keyPairName:"",
  }
})

const closeModal = (skipConfirmation: boolean = false) => {
  uiStore.setModalWindowState(null, skipConfirmation)
}

const externalResults = reactive({})

const createResource = async () => {
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
        Object.assign(externalResults, errors);
      });
};


</script>
