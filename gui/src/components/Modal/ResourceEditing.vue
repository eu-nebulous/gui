<template>
  <div class="flex flex-col text-start">
    <slot name="title"></slot>
    <ResourceForm :resource-data="resourceData" :rules="rules"/>
    <Dialog.Footer>
      <Button type="button" variant="outline-secondary" @click="closeModal(false)" class="w-20 mr-4"> Cancel </Button>
      <Button variant="primary" type="button" class="w-20" @click="editResource"> Save </Button>
    </Dialog.Footer>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue"
import { useUIStore } from "@/store/modules/ui.ts"
import { useResourceStore } from "@/store/modules/resources.ts"
import { useVuelidate } from "@vuelidate/core"
import { required } from "@vuelidate/validators"
import { extractExternalResults } from "@/utils/helper.ts"
import { Dialog } from "@/base-components/Headless"
import Button from "@/base-components/Button"
import Label from "@/base-components/Form/FormLabel.vue"
import Input from "@/base-components/Form/FormInput.vue"
import Select from "@/base-components/Form/FormSelect.vue"
import { SNACKBAR_MESSAGE_TYPES } from "@/constants"
import { IResourcePayload } from "@/types/resource.ts"
import { IPlatform } from "@/interfaces/platform.interface.ts"
import ResourceForm from "@/components/Modal/ResourceForm.vue";
import { IRegion, IRegions } from "@/interfaces/resources.interface.ts"
import _ from "lodash"

interface ResourceEditingProps {
  payload: IResourcePayload & { uuid: string }
}

const props = defineProps<ResourceEditingProps>()

const resourceStore = useResourceStore()
const uiStore = useUIStore()

const availableRegions = ref<IRegions>({
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
})

const resourceData = reactive<IResourcePayload>(props.payload)

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

const mapRegionsForDisplay = () => {
  if (resourceData.platform && resourceData.platform.title === 'AWS') {
    // For AWS, map regions from a comma-separated string to an array of region objects
    if (resourceData.regions && typeof resourceData.regions === 'string') {
      const regionIds = resourceData.regions.split(',')
      resourceData.regions = _.filter(availableRegions.value['AWS'], (region: IRegion) => regionIds.includes(region.region))
    }
  }
}


const formatRegionsForSubmission = () => {
  if (resourceData.platform && resourceData.platform.title === 'AWS') {
    if (Array.isArray(resourceData.regions)) {
      resourceData.regions = resourceData.regions.map((region: IRegion) => region.region).join(',')
    }
  }
}


onMounted(() => {
  mapRegionsForDisplay()
})

const editResource = async () => {
  formatRegionsForSubmission()

  const validate = await  v$.value.$validate()
  if (!validate){
    return
  }

  resourceStore
      .editResource(props.payload.uuid, resourceData)
      .then((editedResource) => {
        closeModal(true)
        uiStore.setSnackbarMessage({
          message: `Successfully edited resource ${editedResource.title}`,
          type: SNACKBAR_MESSAGE_TYPES.SUCCESS
        })
      })
      .catch((error) => {
        const errors = extractExternalResults(error)
        Object.assign($externalResults, errors)
      })
}

</script>