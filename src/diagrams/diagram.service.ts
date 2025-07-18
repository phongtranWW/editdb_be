import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Diagram } from './schemas/diagram.schema';
import { Model } from 'mongoose';
import { CreateDiagramDto } from './dtos/create-diagram.dto';
import { UpdateDiagramDto } from './dtos/update-diagram.dto';
import { DiagramDto } from './dtos/diagram.dto';
import { DiagramDetailDto } from './dtos/diagram-detail.dto';

@Injectable()
export class DiagramService {
  constructor(
    @InjectModel(Diagram.name) private diagramModel: Model<Diagram>,
  ) {}

  async findByUser(userId: string): Promise<DiagramDto[]> {
    try {
      const diagrams = await this.diagramModel
        .find({ userId })
        .select('-tables -relationships -__v')
        .exec();

      return diagrams.map((diagram) => ({
        id: diagram._id.toString(),
        name: diagram.name,
        description: diagram.description,
      }));
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(
    userId: string,
    dto: CreateDiagramDto,
  ): Promise<DiagramDetailDto> {
    try {
      const diagram = new this.diagramModel({ ...dto, userId });
      await diagram.save();

      return {
        id: diagram._id.toString(),
        name: diagram.name,
        description: diagram.description,
        tables: diagram.tables,
        relationships: diagram.relationships,
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, dto: UpdateDiagramDto): Promise<DiagramDetailDto> {
    // Validate diagram's tables
    const tableNames = dto.tables.map((table) => table.name);
    if (tableNames.length !== new Set(tableNames).size) {
      throw new BadRequestException('Table names must be unique');
    }

    // Validate diagram's relationships
    const relationshipNames = dto.relationships.map(
      (relationship) => relationship.name,
    );
    if (relationshipNames.length !== new Set(relationshipNames).size) {
      throw new BadRequestException('Relationship names must be unique');
    }

    // Validate table's columns
    for (const table of dto.tables) {
      const columnNames = table.columns.map((column) => column.name);
      const uniqueColumnNames = new Set(columnNames);
      if (columnNames.length !== uniqueColumnNames.size) {
        throw new BadRequestException(
          `Column names in table "${table.name}" must be unique`,
        );
      }
    }

    const diagram = await this.diagramModel.findById(id);
    if (!diagram) {
      throw new NotFoundException('Diagram not found');
    }
    try {
      const updatedDiagram = await this.diagramModel.findByIdAndUpdate(
        id,
        dto,
        { new: true },
      );

      return {
        id: updatedDiagram!._id.toString(),
        name: updatedDiagram!.name,
        description: updatedDiagram!.description,
        tables: updatedDiagram!.tables,
        relationships: updatedDiagram!.relationships,
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string) {
    const diagram = await this.diagramModel.findById(id);
    if (!diagram) {
      throw new NotFoundException('Diagram not found');
    }
    try {
      return await this.diagramModel.findByIdAndDelete(id);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(error.message);
    }
  }
}
