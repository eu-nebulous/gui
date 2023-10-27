declare module "tailwindcss/lib/util/color" {
  const parseColor = (value: string): { color: Array<string> } => {}
  export { parseColor }
}

declare module "tailwind-config" {
  const config
  export default config
}
