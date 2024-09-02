<template>
  <MultiStepsProvider
    class="mt-8 intro-y"
    ref="multiStepsProviderRef"
    :stages="stagesConfiguration"
    :entrypointComponent="currentStage"
    returnRouteName="applications"
    :responseErrorMessages="responseErrorMessages"
    :v$="v$"
    :save-enabled="applicationData.status =='draft'"
    @saveClick="saveClickHandler"
  >
    <template #title>
      <Input
        v-model="applicationData.title"
        type="text"
        placeholder="Application name"
        :class="{ 'input--invalid': v$.title?.$error || hasTitleBackendSideError }"
      />
    </template>
  </MultiStepsProvider>
</template>

<script setup lang="ts">
import { watchEffect, shallowRef, reactive, ref, computed, provide, Ref } from "vue"
import _ from "lodash"
import { v4 as uuid } from "uuid"
import { IMetricComposite, IMetricRaw } from "@/interfaces/metrics.interface.ts"
import { IVariable } from "@/interfaces/variables.interface.ts"
import { IAppResource } from "@/interfaces/resources.interface.ts"
import { ISLOCompositeExpression } from "@/interfaces/sloviolation.interface.ts"
import { IUtilityFunction } from "@/interfaces/utilityFunctions.interface.ts"
import { IApplication } from "@/interfaces/application.interface.ts"
import MultiStepsProvider from "@/base-components/MultiStepsProvider/index.vue"
import STAGES from "@/components/Application/stages.ts"
import Details from "@/components/Application/Details.vue"
import Resources from "@/components/Application/Resources.vue"
import Metrics from "@/components/Application/Metrics/index.vue"
import ExpressionEditor from "@/components/Application/ExpressionEditor.vue"
import Input from "@/base-components/Form/FormInput.vue"
import { extractValidationError } from "@/utils/helper.ts"
import { useVuelidate } from "@vuelidate/core"
import { required } from "@vuelidate/validators"
import { useApplicationStore } from "@/store/modules/application.ts"
import { ITemplate } from "@/interfaces/template.interface.ts"
import { IParameter } from "@/interfaces/parameter.interface.ts"
import { AxiosError } from "axios"
import {IEnvironment} from "@/interfaces/environment.interface.ts";

interface ApplicationProps {
  applicationApiCall: (payload: Partial<IApplication>) => Promise<IApplication>
  incomingApplicationData?: IApplication
}

const applicationStore = useApplicationStore()

const props = withDefaults(defineProps<ApplicationProps>(), {
  incomingApplicationData: () => ({
    title: "",
    content: "",
    status:"draft",
    uuid:"",
    variables: [{ name: "", lowerValue: 0, higherValue: 0 }],
    environmentVariables: [{ name: "", value: "", secret: true }],
    resources: [],
    templates: [{ id: "", type: "int", minValue: 0, maxValue: 0, unit: "ms" }],
    parameters: [{ name: "", template: "" }],
    metrics: [
      {
        type: "composite",
        name: "",
        formula: "",
        isWindowInput: true,
        isWindowOutput: true,
        level: "global",
        template: "",
        components: [],
        input: {
          type: "all",
          interval: 30,
          unit: "sec"
        },
        output: {
          type: "all",
          interval: 30,
          unit: "sec"
        }
      }
    ],
    sloViolations: { nodeKey: uuid(), isComposite: true, condition: "AND", not: false, children: [] },
    utilityFunctions: [
      {
        functionName: "",
        functionType: "maximize",
        functionExpression: "",
        functionExpressionVariables: []
      }
    ]
  })
})

const applicationData: IApplication = reactive(_.cloneDeep(props.incomingApplicationData))

/* VALIDATION */
const rules = computed(() => ({
  title: { required }
}))

const v$ = useVuelidate(rules, applicationData)

const pathsWithError = ref<Array<string>>([])
const responseErrorMessages = ref<Array<string>>([])
const hasTitleBackendSideError = computed(() => pathsWithError.value.some((path) => path.includes("title")))

provide<Ref<Array<string>>>("pathsWithError", pathsWithError)

const stageDataKeys = {
  [STAGES.APP_DETAILS]: ["content", "variables","environmentVariables"],
  [STAGES.APP_RESOURCES]: ["resources"],
  [STAGES.APP_METRICS]: ["templates", "parameters", "metrics", "sloViolations"],
  [STAGES.APP_EXPRESSION_EDITOR]: ["utilityFunctions"]
}

/* COMPONENTS PARSER */
const componentList = ref<Array<string>>([])

const getComponentList = async () => {
  componentList.value = await applicationStore.invokeYamlComponents(applicationData.content)
}

/* STAGES CONFIGURATION */
const currentStage = ref(STAGES.APP_DETAILS)
const stagesConfiguration = shallowRef()

const handleError = (error: AxiosError<{ data: { error: Array<{ path: string; message: string }> } }>) => {
  const extractedRes = extractValidationError(error)
  if (extractedRes) {
    pathsWithError.value = extractedRes.paths
    responseErrorMessages.value = extractedRes.errorMessages
  }
  return error
}

const updateStagesData = () => {
  stagesConfiguration.value = {
    [STAGES.APP_DETAILS]: {
      stage: 1,
      title: "details",
      component: Details,
      next: STAGES.APP_RESOURCES,
      previous: null,
      onNextPageClick: async (
        next: () => void,
        { content, variables, environmentVariables }: { content: string; variables: Array<IVariable>; environmentVariables:Array<IEnvironment> }
      ) => {

        applicationData.content = content
        applicationData.variables = variables
        applicationData.environmentVariables = environmentVariables
        const stepPayload = {
          title: applicationData.title,
          content: applicationData.content,
          variables: applicationData.variables,
          environmentVariables: applicationData.environmentVariables
        }

        try {
          await Promise.all([getComponentList(), applicationStore.validateApplication(stepPayload)]);
          pathsWithError.value = [];
          responseErrorMessages.value = [];
        } catch (error) {
          handleError(error);
        } finally {
          next();
        }
      },
      payload: {
        content: applicationData.content,
        variables: applicationData.variables,
        environmentVariables: applicationData.environmentVariables
      },
      hasError: pathsWithError.value.some((path) =>
        stageDataKeys[STAGES.APP_DETAILS].some((keys) => path.includes(keys))
      )
    },
    [STAGES.APP_RESOURCES]: {
      stage: 2,
      title: "resources",
      component: Resources,
      next: STAGES.APP_METRICS,
      previous: STAGES.APP_DETAILS,
      onNextPageClick: async (next: () => void, { resources }: { resources: Array<IAppResource> }) => {
        applicationData.resources = resources

        try {
          await applicationStore.validateApplication({ title: applicationData.title, resources: applicationData.resources });
          pathsWithError.value = [];
          responseErrorMessages.value = [];
        } catch (error) {
          handleError(error);
        } finally {
          next();
        }
      },
      onPrevPageClick: async (prev: () => void, { resources }: { resources: Array<IAppResource> }) => {
        applicationData.resources = resources

        try {
          await applicationStore.validateApplication({ title: applicationData.title, resources: applicationData.resources });
          pathsWithError.value = [];
          responseErrorMessages.value = [];
        } catch (error) {
          handleError(error);
        } finally {
          prev();
        }
      },
      payload: {
        appResources: applicationData.resources
      },
      hasError: pathsWithError.value.some((path) =>
        stageDataKeys[STAGES.APP_RESOURCES].some((keys) => path.includes(keys))
      )
    },
    [STAGES.APP_METRICS]: {
      stage: 3,
      title: "metrics",
      component: Metrics,
      next: STAGES.APP_EXPRESSION_EDITOR,
      previous: STAGES.APP_RESOURCES,
      onNextPageClick: async (
        next: () => void,
        {
          templates,
          parameters,
          metrics,
          sloViolations
        }: {
          templates: Array<ITemplate>
          parameters: Array<IParameter>
          metrics: Array<IMetricRaw | IMetricComposite>
          sloViolations: ISLOCompositeExpression
        }
      ) => {
        applicationData.templates = templates
        applicationData.parameters = parameters
        applicationData.metrics = metrics
        applicationData.sloViolations = sloViolations

        try {
          await applicationStore.validateApplication({
            title: applicationData.title,
            templates: applicationData.templates,
            parameters: applicationData.parameters,
            metrics: applicationData.metrics,
            sloViolations: applicationData.sloViolations,
          });
          pathsWithError.value = [];
          responseErrorMessages.value = [];
        } catch (error) {
          handleError(error);
        } finally {
          next(); // Always navigate to the next step
        }
      },
      onPrevPageClick: async (
        prev: () => void,
        {
          templates,
          parameters,
          metrics,
          sloViolations
        }: {
          templates: Array<ITemplate>
          parameters: Array<IParameter>
          metrics: Array<IMetricRaw | IMetricComposite>
          sloViolations: ISLOCompositeExpression
        }
      ) => {
        applicationData.templates = templates
        applicationData.parameters = parameters
        applicationData.metrics = metrics
        applicationData.sloViolations = sloViolations

        try {
          await applicationStore.validateApplication({
            title: applicationData.title,
            templates: applicationData.templates,
            parameters: applicationData.parameters,
            metrics: applicationData.metrics,
            sloViolations: applicationData.sloViolations,
          });
          pathsWithError.value = [];
          responseErrorMessages.value = [];
        } catch (error) {
          handleError(error);
        } finally {
          prev();
        }
      },
      payload: {
        componentList: componentList.value,
        templates: applicationData.templates,
        parameters: applicationData.parameters,
        metrics: applicationData.metrics,
        sloViolations: applicationData.sloViolations
      },
      hasError: pathsWithError.value.some((path) =>
        stageDataKeys[STAGES.APP_METRICS].some((keys) => path.includes(keys))
      )
    },
    [STAGES.APP_EXPRESSION_EDITOR]: {
      stage: 4,
      title: "expression editor",
      component: ExpressionEditor,
      next: null,
      previous: STAGES.APP_METRICS,
      onNextPageClick: async (
        next: () => void,
        { utilityFunctions }: { utilityFunctions: Array<IUtilityFunction> }
      ) => {
        applicationData.utilityFunctions = utilityFunctions

        try {
          await applicationStore.validateApplication({
            title: applicationData.title,
            utilityFunctions: applicationData.utilityFunctions,
          });
          pathsWithError.value = [];
          responseErrorMessages.value = [];
        } catch (error) {
          handleError(error);
        } finally {
          next();
        }
      },
      onPrevPageClick: async (
        prev: () => void,
        { utilityFunctions }: { utilityFunctions: Array<IUtilityFunction> }
      ) => {
        applicationData.utilityFunctions = utilityFunctions

        try {
          await applicationStore.validateApplication({
            title: applicationData.title,
            utilityFunctions: applicationData.utilityFunctions,
          });
          pathsWithError.value = [];
          responseErrorMessages.value = [];
        } catch (error) {
          handleError(error);
        } finally {
          prev();
        }
      },
      payload: {
        metrics: applicationData.metrics.map((metric) => metric.name),
        variables: applicationData.variables.map((variable) => variable.name),
        environmentVariables: applicationData.environmentVariables,
        utilityFunctions: applicationData.utilityFunctions
      },
      hasError: pathsWithError.value.some((path) =>
        stageDataKeys[STAGES.APP_EXPRESSION_EDITOR].some((keys) => path.includes(keys))
      )
    }
  }
}

const saveClickHandler = (data: Partial<IApplication>) => {
  const appPayload = Object.assign(applicationData, data)
  console.log(appPayload)
  appPayload.sloViolations =
    typeof applicationData.sloViolations !== "string"
      ? JSON.stringify(applicationData.sloViolations)
      : applicationData.sloViolations

  props.applicationApiCall(appPayload).catch(handleError)
}

updateStagesData()

watchEffect(() => {
  updateStagesData()
})
</script>
