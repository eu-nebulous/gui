import { getColor } from "@/utils/colors.ts"

const latencyLineChartConfig = (data: Array<number> = []) => ({
  labels: data,
  datasets: [
    {
      label: "Latency",
      data: data,
      borderWidth: 2,
      borderColor: getColor("primary", 0.8),
      backgroundColor: "transparent",
      pointBorderColor: "transparent",
      tension: 0.4
    }
  ]
})
const reconfigDiagramConfig = (data: Array<number> = []) => ({
  labels: data,
  datasets: [
    {
      label: "Html Template",
      maxBarThickness: 30,
      data: data,
      backgroundColor: getColor("indigo.600", 0.4),
      hoverBackgroundColor: getColor("indigo.600")
    }
  ]
})

const deploymentsDiagramConfig = (data: Array<object> = []) => {
  const firstDataset: Array<number> = []
  const secondDataset: Array<number> = []

  data.forEach((item: object) => {
    firstDataset.push(Object.values(item)[0])
    secondDataset.push(Object.values(item)[1])
  })

  return {
    labels: new Array(data.length).fill("Deployment"),
    datasets: [
      {
        label: "Dataset 1",
        data: firstDataset,
        backgroundColor: getColor("red.600"),
        stack: "Stack 0"
      },
      {
        label: "Dataset 2",
        data: secondDataset,
        backgroundColor: getColor("red.600", 0.2),
        stack: "Stack 1"
      }
    ]
  }
}

const violationsLineChartConfig = (data: Array<number> = []) => ({
  labels: data,
  datasets: [
    {
      label: "Violations",
      data: data,
      borderWidth: 2,
      borderColor: getColor("warning", 0.8),
      backgroundColor: "transparent",
      pointBorderColor: "transparent",
      tension: 0.4
    }
  ]
})

export { violationsLineChartConfig, deploymentsDiagramConfig, reconfigDiagramConfig, latencyLineChartConfig }
