import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SummaryDiagramDto } from './dtos/response/summary-diagram.dto';
import { DiagramDto } from './dtos/response/diagram.dto';
import { SortOrder } from 'mongoose';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

@ApiTags('Diagrams')
@ApiBearerAuth()
@Controller()
export class DiagramController {
  constructor(private readonly diagramService: DiagramService) {}

  @ApiResponse({
    status: 200,
  })
  @ApiResponse({ status: 500 })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['asc', 'desc'],
  })
  @Get('diagrams')
  @UseGuards(JwtGuard)
  async findUserSummaryDiagrams(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query(
      'sort',
      new DefaultValuePipe('asc'),
      new ParseEnumPipe(['asc', 'desc']),
    )
    sort: SortOrder,
    @Req() req: Request,
  ): Promise<PaginationDto<SummaryDiagramDto>> {
    const user = req.user as JwtPayload;
    if (!user || !user.sub) {
      throw new NotFoundException('User not found in request');
    }
    return await this.diagramService.findSummaryDiagrams(
      { userId: user.sub, name: { $regex: search, $options: 'i' } },
      page,
      limit,
      sort,
    );
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
