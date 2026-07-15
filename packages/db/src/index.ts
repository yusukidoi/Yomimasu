export * from "./schema";
export { createDb, type Database } from "./client";
export {
  ensureProfile,
  getProfileById,
  setProfileAdmin,
  setProfileAccountRole,
  canAccessPremiumContent,
  type EnsureProfileInput,
} from "./profiles";
export { listAllTexts } from "./admin";
export {
  listTokensForTextSlug,
  updateTextToken,
  setTextPublishStatus,
  type UpdateTokenInput,
} from "./admin-tokens";
export {
  seedDictionaryEntries,
  findDictionaryMatch,
  type DictionaryMatch,
} from "./dictionary";
export {
  processAndStoreTextTokens,
  processTextBySlug,
  upsertAndProcessText,
  type ProcessTextResult,
  type UpsertAndProcessTextInput,
  type UpsertAndProcessTextResult,
} from "./process-text";
export {
  findCachedExplanation,
  storeExplanation,
} from "./ai-explanations";
export {
  countUserAiUsage,
  recordAiUsageEvent,
} from "./ai-usage";
export {
  getProgressSummary,
  recordReadingHeartbeat,
  type ProgressSummary,
} from "./progress";
export { getTextBySlug, getTextForReader, listPublishedTexts } from "./texts";
export {
  countUserVocabulary,
  listUserVocabulary,
  saveUserVocabulary,
  type SaveVocabularyInput,
} from "./vocabulary";
export { SAMPLE_TEXTS, type SampleTextSeed } from "./seed/sample-texts";
