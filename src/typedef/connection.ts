import { ArgsType, Field, Int, ObjectType } from "type-graphql";

@ArgsType()
export class ConnectionArgs {
    @Field(() => Int, {
        description: "How many edges to take from the start.",
        nullable: true,
    })
    public first?: number;

    @Field(() => Int, {
        description: "How many edges to take from the end.",
        nullable: true,
    })
    public last?: number;

    @Field(() => String, {
        description: "If specified, take nodes after this cursor.",
        nullable: true,
    })
    public after?: string | null;

    @Field(() => String, {
        description: "If specified, take nodes before this cursor.",
        nullable: true,
    })
    public before?: string | null;
}

@ObjectType({ description: "Information about pagination in a connection." })
export class PageInfo {
    @Field({ description: "When paginating forwards, are there more items?" })
    public hasNextPage!: boolean;

    @Field({ description: "When paginating backwards, are there more items?" })
    public hasPreviousPage!: boolean;

    @Field(() => String, { nullable: true, description: "When paginating backwards, the cursor to continue." })
    public startCursor?: string | null;

    @Field(() => String, { nullable: true, description: "When paginating forwards, the cursor to continue." })
    public endCursor?: string | null;
}
