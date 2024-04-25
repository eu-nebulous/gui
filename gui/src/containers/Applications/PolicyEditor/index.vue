<template>
  <div class="flex flex-col mt-8 intro-y">
    <div class="flex flex-row justify-between items-center mb-4">
      <h2 class="text-base uppercase">Policy Editor</h2>
      <Button variant="primary" class="uppercase" @click="publishPolicy">Publish</Button>
    </div>

    <div class="md:box flex-grow overflow-x-auto md:p-5"  >
      <MonacoEditor
          v-model="policyStore.rules"
          language="json"
          class="min-h-[400px]"
          id="json_policy_editor"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import {usePolicyStore} from "@/store/modules/policies.ts"
import Button from "@/base-components/Button/Button.vue"
import MonacoEditor from "@/base-components/MonacoEditor";

const policyStore = usePolicyStore()

const publishPolicy = async () => {
  await policyStore.publishPolicies(policyStore.rules)
}


</script>
