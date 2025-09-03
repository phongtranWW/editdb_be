import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Diagram } from './schemas/diagram.schema';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { CreateDiagramDto } from './dtos/request/create-diagram.dto';
import { UpdateDiagramDto } from './dtos/request/update-diagram.dto';
import { SummaryDiagramDto } from './dtos/response/summary-diagram.dto';
import { DiagramDto } from './dtos/response/diagram.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

@Injectable()
export class DiagramService {
  constructor(
    @InjectModel(Diagram.name) private diagramModel: Model<Diagram>,
  ) {}

  async findSummaryDiagrams(
    filter: FilterQuery<Diagram>,
    page: number = 1,
    limit: number = 10,
    sort: SortOrder = 'asc',
  ): Promise<PaginationDto<SummaryDiagramDto>> {
    try {
      const diagrams = await this.diagramModel
        .find(filter)
        .select('_id name type createdAt updatedAt')
        .sort({ name: sort, createdAt: 'asc' })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
      const total = await this.diagramModel.countDocuments(filter);

      return {
        total,
        data: diagrams.map((diagram) => ({
          id: diagram._id.toString(),
          type: diagram.type,
          name: diagram.name,
          createdAt: diagram.createdAt,
          updatedAt: diagram.updatedAt,
        })),
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(error.message);
    }
  }

  async findDiagramById(filter: FilterQuery<Diagram>): Promise<DiagramDto> {
    const diagram = await this.diagramModel
      .findOne(filter)
      .select('-__v')
      .exec();

    if (!diagram) {
      throw new NotFoundException('Diagram not found');
    }

    return {
      id: diagram._id.toString(),
      name: diagram.name,
      tables: diagram.tables,
      relationships: diagram.relationships,
      type: diagram.type,
      createdAt: diagram.createdAt,
      updatedAt: diagram.updatedAt,
    };
  }

  async create(userId: string, dto: CreateDiagramDto): Promise<DiagramDto> {
    try {
      const diagram = new this.diagramModel({ ...dto, userId });
      await diagram.save();

      return {
        id: diagram._id.toString(),
        name: diagram.name,
        tables: diagram.tables,
        relationships: diagram.relationships,
        type: diagram.type,
        createdAt: diagram.createdAt,
        updatedAt: diagram.updatedAt,
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateDiagramDto,
  ): Promise<DiagramDto> {
    const diagram = await this.diagramModel.findOne({ _id: id, userId });
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
        tables: updatedDiagram!.tables,
        relationships: updatedDiagram!.relationships,
        type: updatedDiagram!.type,
        createdAt: updatedDiagram!.createdAt,
        updatedAt: updatedDiagram!.updatedAt,
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string, userId: string): Promise<void> {
    const diagram = await this.diagramModel.findOne({ _id: id, userId });
    if (!diagram) {
      throw new NotFoundException('Diagram not found');
    }
    try {
      await this.diagramModel.findByIdAndDelete(id);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(error.message);
    }
  }
}
