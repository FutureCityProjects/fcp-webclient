import { SelfAssessment } from "api/schema"
import has from "lodash/has"

export const progressLabels = {
  [SelfAssessment.Starting]: "progress.0",
  [SelfAssessment.MakingProgress]: "progress.25",
  [SelfAssessment.HalfFinished]: "progress.50",
  [SelfAssessment.AlmostFinished]: "progress.75",
  [SelfAssessment.Complete]: "progress.100",
}

export const progressToText = (progress: SelfAssessment): string => has(progressLabels, progress)
  ? progressLabels[progress]
  : "progress.unknown"
