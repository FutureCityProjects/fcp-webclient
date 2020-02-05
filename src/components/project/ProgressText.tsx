import { SelfAssessment } from "api/schema"
import has from "lodash/has"

export const progressLabels = {
  [SelfAssessment.STARTING]: "progress.0",
  [SelfAssessment.MAKING_PROGRESS]: "progress.25",
  [SelfAssessment.HALF_FINISHED]: "progress.50",
  [SelfAssessment.ALMOST_FINISHED]: "progress.75",
  [SelfAssessment.COMPLETE]: "progress.100",
}

export const progressToText = (progress: SelfAssessment) => has(progressLabels, progress)
  ? progressLabels[progress]
  : "progress.unknown"
