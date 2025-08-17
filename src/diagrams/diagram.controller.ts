import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DiagramService } from './diagram.service';
import { CreateDiagramDto } from './dtos/request/create-diagram.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateDiagramDto } from './dtos/request/update-diagram.dto';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/strategies/types/jwt-payload.type';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SummaryDiagramDto } from './dtos/response/summary-diagram.dto';
import { DiagramDto } from './dtos/response/diagram.dto';
import { UpdateShareSettingsDto } from './dtos/request/update-share-setting.dto';

@ApiTags('Diagrams')
@ApiBearerAuth()
@Controller()
export class DiagramController {
  constructor(private readonly diagramService: DiagramService) {}

  @ApiResponse({
    status: 200,
    type: [SummaryDiagramDto],
  })
  @ApiResponse({ status: 500 })
  @Get('diagrams')
  @UseGuards(JwtGuard)
  async findUserSummaryDiagrams(
    @Req() req: Request,
  ): Promise<SummaryDiagramDto[]> {
    const user = req.user as JwtPayload;
    if (!user || !user.sub) {
      throw new NotFoundException('User not found in request');
    }
    return await this.diagramService.findSummaryDiagrams({ userId: user.sub });
  }

  @ApiResponse({
    status: 200,
    type: DiagramDto,
  })
  @ApiResponse({ status: 404, description: 'Diagram not found' })
  @Get('diagrams/:id')
  @UseGuards(JwtGuard)
  async findDiagramById(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<DiagramDto> {
    const user = req.user as JwtPayload;
    if (!user || !user.sub) {
      throw new NotFoundException('User not found in request');
    }
    return await this.diagramService.findDiagramById({
      _id: id,
      userId: user.sub,
    });
  }

  @Post('diagrams')
  @ApiBody({ type: CreateDiagramDto })
  @ApiResponse({ status: 201, type: DiagramDto })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 500 })
  @UseGuards(JwtGuard)
  async create(
    @Body() dto: CreateDiagramDto,
    @Req() req: Request,
  ): Promise<DiagramDto> {
    const user = req.user as JwtPayload;
    if (!user || !user.sub) {
      throw new NotFoundException('User not found in request');
    }
    return this.diagramService.create(user.sub, dto);
  }

  @Put('diagrams/:id')
  @ApiBody({ type: UpdateDiagramDto })
  @ApiResponse({
    status: 200,
    type: DiagramDto,
  })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 500 })
  @UseGuards(JwtGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDiagramDto,
    @Req() req: Request,
  ): Promise<DiagramDto> {
    const user = req.user as JwtPayload;
    if (!user || !user.sub) {
      throw new NotFoundException('User not found in request');
    }
    return this.diagramService.update(id, user.sub, dto);
  }

  @Patch('diagrams/:id/share')
  @ApiBody({ type: UpdateShareSettingsDto })
  @ApiResponse({
    status: 200,
    type: DiagramDto,
  })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 500 })
  @UseGuards(JwtGuard)
  async updateShareSettings(
    @Param('id') id: string,
    @Body() dto: UpdateShareSettingsDto,
    @Req() req: Request,
  ): Promise<DiagramDto> {
    const user = req.user as JwtPayload;
    if (!user || !user.sub) {
      throw new NotFoundException('User not found in request');
    }
    return this.diagramService.updateShareSettings(id, user.sub, dto);
  }

  @Delete('diagrams/:id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 500 })
  @UseGuards(JwtGuard)
  async delete(@Param('id') id: string, @Req() req: Request): Promise<void> {
    const user = req.user as JwtPayload;
    if (!user || !user.sub) {
      throw new NotFoundException('User not found in request');
    }
    return await this.diagramService.delete(id, user.sub);
  }
}
