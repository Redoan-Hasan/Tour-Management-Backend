import { Query } from "mongoose";
import { excludedFields } from "../GlobalConstants/globalConstants";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;
  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }
  filter(): this {
    const filter = { ...this.query };
    for (const field of excludedFields) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filter[field];
    }
    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }

  search(searchableFileds: string[]): this {
    const searchTerm = this.query?.searchTerm || "";
    const searchQuery = {
      $or: searchableFileds.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    };
    this.modelQuery = this.modelQuery.find(searchQuery);
    return this;
  }

  sort(): this {
    const sort = this.query?.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  field(): this {
    const field = this.query?.field?.split(",").join("") || "";
    this.modelQuery = this.modelQuery.select(field);
    return this;
  }

  paginate(): this {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  };

  build() {
    return this.modelQuery;
  };

  async getMeta(){
    const totalCount = await this.modelQuery.model.countDocuments();
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    return {
      page,
      limit,
      total: totalCount,
      totalPage : Math.ceil(totalCount/limit)
    };
  }
}
