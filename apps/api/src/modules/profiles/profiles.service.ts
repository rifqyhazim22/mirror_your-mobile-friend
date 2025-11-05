import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { MirrorProfile } from "./profile.interface";

@Injectable()
export class ProfilesService {
  private readonly store = new Map<string, MirrorProfile>();

  create(payload: CreateProfileDto) {
    const id = randomUUID();
    const profile = this.mapPayloadToProfile(id, payload);
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

  update(id: string, payload: CreateProfileDto) {
    if (!this.store.has(id)) {
      throw new NotFoundException(`Profile ${id} tidak ditemukan`);
    }
    const updated = this.mapPayloadToProfile(id, payload, this.store.get(id)!);
    this.store.set(id, updated);
    return updated;
  }

  private mapPayloadToProfile(
    id: string,
    payload: CreateProfileDto,
    current?: MirrorProfile,
  ): MirrorProfile {
    return {
      id,
      nickname: (payload.nickname ?? current?.nickname ?? "").trim(),
      focusAreas: Array.isArray(payload.focusAreas)
        ? payload.focusAreas
        : current?.focusAreas ?? [],
      consentCamera:
        payload.consentCamera ?? current?.consentCamera ?? false,
      consentData: payload.consentData ?? current?.consentData ?? false,
      moodBaseline: payload.moodBaseline ?? current?.moodBaseline ?? "tenang",
      createdAt: current?.createdAt ?? new Date().toISOString(),
    };
  }
}
