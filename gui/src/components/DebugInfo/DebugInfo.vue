<template>

  <Menu>
    <Menu.Button
        class="flex items-center justify-center w-8 h-8 overflow-hidden rounded-full shadow-lg image-fit zoom-in intro-x uppercase"
    >
      <Lucide icon="Info" class="w-5 h-5 text-slate-300 intro-x cursor-pointer"/>
    </Menu.Button>

    <Menu.Items
        class="w-80 mt-px relative bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white"
    >
      <Menu.Header class="font-normal">
        <div class="font-medium">App Information</div>
      </Menu.Header>
      <Menu.Divider class="bg-white/[0.08]" />
      <Menu.Item>
        <a class="block w-full bg-blend-color-dodge" :href="backend" target="_blank">Backend <Lucide class="inline-block w-4 h-4 align-text-bottom	" icon="ExternalLink"/></a>
      </Menu.Item>
      <Menu.Item><strong>Environment</strong>: {{ environment }}</Menu.Item>
      <Menu.Item><strong>Build</strong>: {{ build_id }}</Menu.Item>
      <Menu.Item><strong>Context</strong>: {{ context }}</Menu.Item>
    </Menu.Items>
  </Menu>

</template>
<script setup lang="ts">
import {Menu} from "@/base-components/Headless";
import Lucide from "@/base-components/Lucide";


const backend = import.meta.env.VITE_API_URL
const environment = import.meta.env.NODE_VERSION
const build_id = import.meta.env.VITE_BUILD_ID
const context = import.meta.env.VITE_CONTEXT

console.log(import.meta);

</script>