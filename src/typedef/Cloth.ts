import { Field, ObjectType, registerEnumType } from "type-graphql";

export enum ClothType {
    shirt = "shirt",
    jeans = "jeans",
    coat = "coat",
}

export enum ClothSize {
    small = "small",
    medium = "medium",
    large = "large",
}

registerEnumType(ClothType, {
    name: "ClothType",
    description: "Type of clothes.",
});

registerEnumType(ClothSize, {
    name: "ClothSize",
    description: "Size of clothes.",
});

@ObjectType({ description: "Cloth of a human." })
export class Cloth {
    @Field(() => ClothType, { description: "Type of cloth." })
    public type!: ClothType;

    @Field(() => ClothSize, { description: "Size of cloth." })
    public size!: ClothSize;

    @Field(() => String, { description: "Color of cloth." })
    public color!: string;
}
