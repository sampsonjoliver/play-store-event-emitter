/// <reference types="aws-sdk" />

declare module "dynamodb-toolbox" {
  import { DynamoDB } from "aws-sdk";
  import { DocumentClient } from "aws-sdk/clients/dynamodb";

  export type TableOpts = {
    name: string;
    partitionKey: string;
    DocumentClient: DynamoDB.DocumentClient;
    alias?: string;
    sortKey?: string;
    entityField?: boolean | string;
    attributes?: object;
    indexes?: objects;
    autoExecute?: boolean;
    autoParse?: boolean;
    removeNullAttributes?: boolean;
  };

  export type EntityOpts<T> = {
    name: string;
    attributes: { [key in keyof T]?: EntityAttributeOpts };
    table: Table;
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
    type?: string;
    map?: string;
    alias?: string;
  };

  export declare class Table {
    constructor(opts: TableOpts);

    DocumentClient: DocumentClient;
  }

  export declare class Entity<T> {
    constructor(opts: EntityOpts<T>);

    put(object: T): Promise;
    update(object: T): Promise;
    get(object: Partial<T>, { consistent: boolean }): Promise<{ Item: T }>;
    delete(object: Partial<T>): Promise;
    parse(entity: any): T;
    query(partitionKey: string): Promise<{ Count: number; Items: T[] }>;
    scan(partitionKey: string): Promise<{ Count: number; Items: T[] }>;
  }
}
