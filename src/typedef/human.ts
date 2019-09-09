import { Field, ID, Int, ObjectType } from "type-graphql";
import { Cloth } from "./Cloth";
import { PageInfo } from "./connection";

@ObjectType({ description: "A connection to a list of human." })
export class HumanConnection {
    @Field({ description: "Information to aid in pagination." })
    public pageInfo!: PageInfo;
    @Field(() => [HumanEdge], { description: "A list of edges." })
    public edges?: HumanEdge[];
}

@ObjectType({ description: "An edge in a conenction." })
export class HumanEdge {
    @Field(() => Human, { description: "The human at the end of the edge" })
    public node!: Human;
    @Field({ description: "A cursor for use in pagination" })
    public cursor!: string;
}

@ObjectType({ description: "Human" })
export class Human {
    @Field(() => ID, { description: "ID of this human." })
    public id!: string;

    @Field(() => String, { description: "Name of this human.", complexity: 5 })
    public name!: string;

    @Field(() => Int, { description: "Age of this human." })
    public age!: number;
}
