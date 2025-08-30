<template>
<h1> Hello {{props.uuid}}</h1>
</template>
<script setup lang="ts">

interface AppMonitoringProps {
  uuid: string,
}

const props = defineProps<AppMonitoringProps>()


</script>