import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateMoodEntryDto } from "./dto/create-mood-entry.dto";

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateProfileDto, ownerId: string) {
    return this.prisma.profile.create({
      data: {
        ownerId,
        nickname: payload.nickname.trim(),
        focusAreas: payload.focusAreas ?? [],
        consentCamera: Boolean(payload.consentCamera),
        consentData: Boolean(payload.consentData),
        moodBaseline: payload.moodBaseline ?? "tenang",
      },
    });
  }

  async findOne(id: string, ownerId: string) {
    const profile = await this.prisma.profile.findFirst({
      where: { id, ownerId },
      include: {
        moodEntries: {
          orderBy: { createdAt: "desc" },
          take: 30,
        },
      },
    });
    if (!profile) {
      throw new NotFoundException(`Profile ${id} tidak ditemukan`);
    }
    return profile;
  }

  async update(id: string, ownerId: string, payload: CreateProfileDto) {
    await this.ensureOwnership(id, ownerId);
    return this.prisma.profile.update({
      where: { id },
      data: {
        nickname: payload.nickname.trim(),
        focusAreas: payload.focusAreas ?? [],
        consentCamera: Boolean(payload.consentCamera),
        consentData: Boolean(payload.consentData),
        moodBaseline: payload.moodBaseline ?? "tenang",
      },
    });
  }

  async addMoodEntry(
    profileId: string,
    ownerId: string,
    payload: CreateMoodEntryDto,
  ) {
    await this.ensureOwnership(profileId, ownerId);
    return this.prisma.moodEntry.create({
      data: {
        profileId,
        mood: payload.mood,
        note: payload.note?.trim() || null,
      },
    });
  }

  async listMoodEntries(profileId: string, ownerId: string) {
    await this.ensureOwnership(profileId, ownerId);
    return this.prisma.moodEntry.findMany({
      where: { profileId },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
  }

  private async ensureOwnership(id: string, ownerId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) {
      throw new NotFoundException(`Profile ${id} tidak ditemukan`);
    }
    if (profile.ownerId !== ownerId) {
      throw new ForbiddenException();
    }
  }
}
