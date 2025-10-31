export class CreateProfileDto {
  nickname: string;
  focusAreas: string[];
  consentCamera: boolean;
  consentData: boolean;
  moodBaseline: "tenang" | "bersemangat" | "lelah";
}
