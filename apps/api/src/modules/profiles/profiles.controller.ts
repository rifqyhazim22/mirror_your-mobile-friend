import { Body, Controller, Get, Param, Post, Put, UseGuards, Req } from "@nestjs/common";
import type { Request } from "express";
import type { AuthPayload } from "../auth/auth.service";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { ProfilesService } from "./profiles.service";
import { AuthGuard } from "../auth/auth.guard";
import { CreateMoodEntryDto } from "./dto/create-mood-entry.dto";

@UseGuards(AuthGuard)
@Controller({ path: "profiles", version: "1" })
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateProfileDto) {
    const owner = (req as Request & { user?: AuthPayload }).user;
    return this.profilesService.create(dto, owner!.sub);
  }

  @Get(":id")
  findOne(@Req() req: Request, @Param("id") id: string) {
    const owner = (req as Request & { user?: AuthPayload }).user;
    return this.profilesService.findOne(id, owner!.sub);
  }

  @Put(":id")
  update(@Req() req: Request, @Param("id") id: string, @Body() dto: CreateProfileDto) {
    const owner = (req as Request & { user?: AuthPayload }).user;
    return this.profilesService.update(id, owner!.sub, dto);
  }

  @Post(":id/mood-entries")
  addMoodEntry(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() dto: CreateMoodEntryDto,
  ) {
    const owner = (req as Request & { user?: AuthPayload }).user;
    return this.profilesService.addMoodEntry(id, owner!.sub, dto);
  }

  @Get(":id/mood-entries")
  listMoodEntries(@Req() req: Request, @Param("id") id: string) {
    const owner = (req as Request & { user?: AuthPayload }).user;
    return this.profilesService.listMoodEntries(id, owner!.sub);
  }

  @Get(":id/mood-entries/summary")
  summarizeMoodEntries(@Req() req: Request, @Param("id") id: string) {
    const owner = (req as Request & { user?: AuthPayload }).user;
    return this.profilesService.summarizeMoodEntries(id, owner!.sub);
  }
}
