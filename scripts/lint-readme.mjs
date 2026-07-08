import { readFileSync } from "node:fs"

const readme = readFileSync("README.md", "utf8")
const forbidden = [
  "Development environment setup scripts",
  "install_rust.sh",
  "install_nvm.sh",
  "install_python.sh",
  "install_conda.sh",
  "install_docker.sh",
  "./setup.sh --all",
]

const failures = []

if (!readme.startsWith("# BKG OpenCode Plugin DFMA")) {
  failures.push("README must start with plugin-first title.")
}

for (const needle of forbidden) {
  if (readme.includes(needle)) {
    failures.push(`README still contains forbidden legacy setup content: ${needle}`)
  }
}

if (!readme.includes("## Dashboard")) failures.push("README must document Dashboard usage.")
if (!readme.includes("## BitShit adapter")) failures.push("README must document BitShit adapter usage.")
if (!readme.includes("## Development")) failures.push("README must document development checks.")

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"))
  process.exit(1)
}

console.log("README lint passed")
