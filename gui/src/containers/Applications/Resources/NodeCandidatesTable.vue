<template>
  <div class="flex-grow overflow-x-auto">
    <Table class="border-spacing-y-[10px] border-separate -mt-2 min-w-full max-w-max w-max">
      <Table.Thead>
        <Table.Tr>
          <Table.Th class="border-b-0 whitespace-nowrap"> Region </Table.Th>
          <Table.Th class="border-b-0 whitespace-nowrap"> Instance Type </Table.Th>
          <Table.Th class="border-b-0 whitespace-nowrap"> Vcores </Table.Th>
          <Table.Th class="border-b-0 whitespace-nowrap"> Memory (GB) </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr v-for="(node, index) in nodeCandidates" :key="index">
          <Table.Td
            class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
          >
            {{ node.region }}
          </Table.Td>
          <Table.Td
            class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
          >
            {{ node.instanceType }}
          </Table.Td>
          <Table.Td
            class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
          >
            {{ node.virtualCores }}
          </Table.Td>
          <Table.Td
            class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
          >
            {{ node.memory }}
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import Table from "@/base-components/Table"
interface INodeCandidates {
  id: number
  region: string
  instanceType: string
  virtualCores: number
  memory: number
}

const nodeCandidates = ref<Array<INodeCandidates>>([
  {
    id: 1,
    region: "eu-west",
    instanceType: "m7g.xlarge",
    virtualCores: 2,
    memory: 6
  },
  {
    id: 2,
    region: "eu-west",
    instanceType: "m7g.xlarge",
    virtualCores: 2,
    memory: 6
  },
  {
    id: 3,
    region: "eu-west",
    instanceType: "m7g.xlarge",
    virtualCores: 2,
    memory: 6
  },
  {
    id: 4,
    region: "eu-west",
    instanceType: "m7g.xlarge",
    virtualCores: 2,
    memory: 6
  },
  {
    id: 5,
    region: "eu-west",
    instanceType: "m7g.xlarge",
    virtualCores: 2,
    memory: 6
  },
  {
    id: 6,
    region: "eu-west",
    instanceType: "m7g.xlarge",
    virtualCores: 2,
    memory: 6
  },
  {
    id: 7,
    region: "eu-west",
    instanceType: "m7g.xlarge",
    virtualCores: 2,
    memory: 6
  },
  {
    id: 8,
    region: "eu-west",
    instanceType: "m7g.xlarge",
    virtualCores: 2,
    memory: 6
  }
])
</script>
