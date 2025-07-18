import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DiagramService } from './diagram.service';
import { CreateDiagramDto } from './dtos/create-diagram.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateDiagramDto } from './dtos/update-diagram.dto';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/strategies/types/jwt-payload.type';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DiagramDto } from './dtos/diagram.dto';
import { DiagramDetailDto } from './dtos/diagram-detail.dto';

@ApiTags('Diagrams')
@ApiBearerAuth()
@Controller('diagrams')
export class DiagramController {
  constructor(private readonly diagramService: DiagramService) {}

  @ApiResponse({
    status: 200,
    type: [DiagramDto],
  })
  @ApiResponse({ status: 500 })
  @Get()
  @UseGuards(JwtGuard)
  async findAll(@Req() req: Request) {
    const user = req.user as JwtPayload;
    if (!user || !user.sub) {
      throw new NotFoundException('User not found in request');
    }
    return this.diagramService.findByUser(user.sub);
  }

  @Post()
  @ApiBody({ type: CreateDiagramDto })
  @ApiResponse({ status: 201, type: DiagramDetailDto })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 500 })
  @UseGuards(JwtGuard)
  async create(@Body() dto: CreateDiagramDto, @Req() req: Request) {
    const user = req.user as JwtPayload;
    if (!user || !user.sub) {
      throw new NotFoundException('User not found in request');
    }
    return this.diagramService.create(user.sub, dto);
  }

  @Put(':id')
  @ApiBody({ type: UpdateDiagramDto })
  @ApiResponse({
    status: 200,
    type: DiagramDetailDto,
  })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 500 })
  @UseGuards(JwtGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDiagramDto,
    @Req() req: Request,
  ) {
    const user = req.user as JwtPayload;
    if (!user || !user.sub) {
      throw new NotFoundException('User not found in request');
    }
    return this.diagramService.update(id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 500 })
  @UseGuards(JwtGuard)
  async delete(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as JwtPayload;
    if (!user || !user.sub) {
      throw new NotFoundException('User not found in request');
    }
    return this.diagramService.delete(id);
  }
}
