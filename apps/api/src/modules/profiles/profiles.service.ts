import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { MirrorProfile } from "./profile.interface";

@Injectable()
export class ProfilesService {
  private readonly store = new Map<string, MirrorProfile>();

  create(payload: CreateProfileDto) {
    const id = randomUUID();
    const profile: MirrorProfile = {
      id,
      nickname: (payload.nickname ?? "").trim(),
      focusAreas: Array.isArray(payload.focusAreas) ? payload.focusAreas : [],
      consentCamera: Boolean(payload.consentCamera),
      consentData: Boolean(payload.consentData),
      moodBaseline: payload.moodBaseline ?? "tenang",
      createdAt: new Date().toISOString(),
    };
    this.store.set(id, profile);
    return profile;
  }

  findOne(id: string) {
    const profile = this.store.get(id);
    if (!profile) {
      throw new NotFoundException(`Profile ${id} tidak ditemukan`);
    }
    return profile;
  }
}
