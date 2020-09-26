/// <reference types="aws-sdk" />

declare module "dynamodb-toolbox" {
  import { DynamoDB } from "aws-sdk";
  import { DocumentClient } from "aws-sdk/clients/dynamodb";

  export type TableOpts<P extends string, S extends string> = {
    name: string;
    partitionKey: P;
    sortKey?: S;
    DocumentClient: DynamoDB.DocumentClient;
    alias?: string;
    entityField?: boolean | string;
    attributes?: object;
    indexes?: objects;
    autoExecute?: boolean;
    autoParse?: boolean;
    removeNullAttributes?: boolean;
  };

  export declare class Table<P, S> {
    constructor(opts: TableOpts<P, S>);

    DocumentClient: DocumentClient;
    name: string;
  }

  export type EntityType = "string" | "number" | "list" | "map";

  export type EntityOpts<Attrs, P, S> = {
    name: string;
    table: Table<P, S>;
    attributes?: {
      [key in keyof Attrs]?: EntityAttributeOpts | EntityType;
    };
    timestamps?: boolean;
    created?: string;
    modified?: string;
    createdAlias?: string;
    modifiedAlias?: string;
    typeAlias?: string;
    autoExecute?: boolean;
    autoParse?: boolean;
  };

  export type EntityAttributeOpts = {
    partitionKey?: boolean;
    hidden?: boolean;
    sortKey?: boolean;
    type?: EntityType;
    map?: string;
    alias?: string;
  };

  export declare class Entity<T> {
    constructor(opts: EntityOpts<T>);

    put(object: T): Promise<T>;
    update(object: T): Promise;
    get(object: Partial<T>, { consistent: boolean }): Promise<{ Item: T }>;
    delete(object: Partial<T>): Promise;
    parse(entity: any): T;
    query(partitionKey: string): Promise<{ Count: number; Items: T[] }>;
    scan(partitionKey: string): Promise<{ Count: number; Items: T[] }>;
  }
}
