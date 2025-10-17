import { getColor } from "@/utils/colors.ts"


// Mock data for each chart type
const mockData = {
  latency: [45, 52, 48, 65, 58, 72, 68, 75, 82, 78, 85, 90],
  reconfig: [12, 19, 15, 25, 22, 18, 28, 32, 35, 30, 38, 42],
  deployments: [
    { success: 15, failed: 3 },
    { success: 22, failed: 5 },
    { success: 18, failed: 2 },
    { success: 25, failed: 4 },
    { success: 30, failed: 6 },
    { success: 28, failed: 3 },
    { success: 35, failed: 7 },
    { success: 32, failed: 5 }
  ],
  violations: [5, 8, 12, 10, 15, 18, 14, 20, 16, 22, 19, 25]
}

// Generate labels for time-series data
const generateTimeLabels = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date()
    date.setHours(date.getHours() - (count - i - 1))
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  })
}

// Pastel color palette
const pastelColors = {
  primary: "#B8D4E3", // Soft blue
  secondary: "#D4B8E3", // Soft purple
  success: "#B8E3D4", // Soft mint
  warning: "#E3D4B8", // Soft peach
  danger: "#E3B8D4", // Soft pink
  info: "#B8C7E3", // Soft sky blue
  indigo: "#C7B8E3", // Soft lavender
  teal: "#B8E3E0", // Soft teal
  yellow: "#E3E0B8", // Soft yellow
  rose: "#E3B8C7" // Soft rose
}


const latencyLineChartConfig = (data: Array<number> = []) => {
  // Always use mock data, ignoring the input parameter
  const chartData = mockData.latency

  return {
    labels: generateTimeLabels(chartData.length),
    datasets: [
      {
        label: "Latency (ms)",
        data: chartData,
        borderWidth: 2,
        borderColor: pastelColors.primary,
        backgroundColor: "transparent",
        pointBorderColor: pastelColors.primary,
        pointBackgroundColor: "#FFFFFF",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4
      }
    ]
  }
}
const reconfigDiagramConfig = (data: Array<number> = []) => {
  // Always use mock data, ignoring the input parameter
  const chartData = mockData.reconfig

  return {
    labels: generateTimeLabels(chartData.length),
    datasets: [
      {
        label: "Html Template Reconfigurations",
        maxBarThickness: 30,
        data: chartData,
        backgroundColor: pastelColors.indigo,
        hoverBackgroundColor: pastelColors.secondary,
        borderColor: pastelColors.secondary,
        borderWidth: 1
      }
    ]
  }
}


const deploymentsDiagramConfig = (data: Array<object> = []) => {
  // Always use mock data, ignoring the input parameter
  const chartData = mockData.deployments

  const firstDataset: Array<number> = []
  const secondDataset: Array<number> = []

  chartData.forEach((item: object) => {
    firstDataset.push(Object.values(item)[0])
    secondDataset.push(Object.values(item)[1])
  })

  return {
    labels: chartData.map((_, index) => `Deploy ${index + 1}`),
    datasets: [
      {
        label: "Successful",
        data: firstDataset,
        backgroundColor: pastelColors.success,
        borderColor: pastelColors.success,
        borderWidth: 1,
        stack: "Stack 0"
      },
      {
        label: "Failed",
        data: secondDataset,
        backgroundColor: pastelColors.danger,
        borderColor: pastelColors.danger,
        borderWidth: 1,
        stack: "Stack 0"
      }
    ]
  }
}
const violationsLineChartConfig = (data: Array<number> = []) => {
  // Always use mock data, ignoring the input parameter
  const chartData = mockData.violations

  return {
    labels: generateTimeLabels(chartData.length),
    datasets: [
      {
        label: "Policy Violations",
        data: chartData,
        borderWidth: 2,
        borderColor: pastelColors.warning,
        backgroundColor: `${pastelColors.warning}20`, // Add transparency for area fill
        pointBorderColor: pastelColors.warning,
        pointBackgroundColor: "#FFFFFF",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true
      }
    ]
  }
}

export { violationsLineChartConfig, deploymentsDiagramConfig, reconfigDiagramConfig, latencyLineChartConfig }
