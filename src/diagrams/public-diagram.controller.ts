import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SummaryDiagramDto } from './dtos/response/summary-diagram.dto';
import { DiagramService } from './diagram.service';
import { DiagramDto } from './dtos/response/diagram.dto';
import { Visibility } from './types/visibility.type';

@ApiTags('Public Diagrams')
@Controller('public/diagrams')
export class PublicDiagramController {
  constructor(private readonly diagramService: DiagramService) {}
  @ApiResponse({
    status: 200,
    type: [SummaryDiagramDto],
  })
  @ApiResponse({ status: 500 })
  @Get()
  async findPublicSummaryDiagrams(): Promise<SummaryDiagramDto[]> {
    return await this.diagramService.findSummaryDiagrams({
      visibility: Visibility.PUBLIC,
    });
  }

  @ApiResponse({
    status: 200,
    type: DiagramDto,
  })
  @ApiResponse({ status: 404, description: 'Diagram not found' })
  @ApiResponse({ status: 500 })
  @Get(':id')
  async findPublicDiagram(@Param('id') id: string): Promise<DiagramDto> {
    return await this.diagramService.findDiagramById({
      _id: id,
      visibility: Visibility.PUBLIC,
    });
  }
}
