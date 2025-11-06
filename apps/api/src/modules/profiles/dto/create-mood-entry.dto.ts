export type MoodEntrySource = "manual" | "camera" | "imported";

export class CreateMoodEntryDto {
  mood!: string;
  note?: string;
  source?: MoodEntrySource;
}
