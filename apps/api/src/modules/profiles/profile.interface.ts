export interface MirrorProfile {
  id: string;
  nickname: string;
  focusAreas: string[];
  consentCamera: boolean;
  consentData: boolean;
  moodBaseline: "tenang" | "bersemangat" | "lelah";
  createdAt: string;
}
