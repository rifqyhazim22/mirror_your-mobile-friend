import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { ProfilesService } from "./profiles.service";

@Controller({ path: "profiles", version: "1" })
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  create(@Body() dto: CreateProfileDto) {
    return this.profilesService.create(dto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.profilesService.findOne(id);
  }
}
