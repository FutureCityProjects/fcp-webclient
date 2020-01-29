import has from "lodash/has"

export const progressLabels = {
  0: "progress.0",
  25: "progress.25",
  50: "progress.50",
  75: "progress.75",
  100: "progress.100",
}

export const progressToText = (progress: number) => has(progressLabels, progress)
  ? progressLabels[progress]
  : "progress.unknown"
