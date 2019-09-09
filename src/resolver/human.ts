import { parse } from "graphql";
import { Arg, Ctx, FieldResolver, ID, Query, Root, Resolver } from "type-graphql";
import { Cloth, ClothSize, ClothType } from "../typedef/Cloth";
import { Human, HumanConnection } from "../typedef/human";

@Resolver(Human)
export class HumanResolver {
    private humanData = [
        {
            id: "1",
            name: "human1",
            age: 32,
            friends: ["2", "3"],
        },
        {
            id: "2",
            name: "human2",
            age: 27,
            friends: ["1"],
        },
        {
            id: "3",
            name: "human3",
            age: 34,
            friends: ["1", "4"],
        },
        {
            id: "4",
            name: "human4",
            age: 33,
            friends: ["3", "5"],
        },
        {
            id: "5",
            name: "human5",
            age: 33,
            friends: ["4"],
        },
    ];

    private clothData: Array<{ clothType: ClothType, clothSize: ClothSize, color: string, human: string[] }> = [
        {
            clothType: ClothType.shirt,
            clothSize: ClothSize.small,
            color: "red",
            human: ["1", "3", "5"],
        },
        {
            clothType: ClothType.jeans,
            clothSize: ClothSize.large,
            color: "blue",
            human: ["2", "3", "4"],
        },
        {
            clothType: ClothType.jeans,
            clothSize: ClothSize.medium,
            color: "skyblue",
            human: ["1", "5"],
        },
        {
            clothType: ClothType.coat,
            clothSize: ClothSize.medium,
            color: "grey",
            human: ["1", "2", "3"],
        },
        {
            clothType: ClothType.shirt,
            clothSize: ClothSize.medium,
            color: "green",
            human: ["3", "4", "5"],
        },
    ];

    @Query(() => Human, { nullable: true, description: "Fetch human data." })
    public async human(
        @Arg("id", () => ID, { description: "ID of human to fetch." })
        id: string,
    ): Promise<Human | null> {
        const fetchResult = this.humanFetcher(id);
        if (fetchResult) {
            return {
                id: fetchResult.id,
                age: fetchResult.age,
                name: fetchResult.name,
            };
        } else {
            return null;
        }
    }

    @FieldResolver(() => [Cloth], { description: "Clothes for this human." })
    public async clothes(
        @Root() human: Human,
    ): Promise<Cloth[]> {
        return this.clothesFetcher(human.id);
    }

    @FieldResolver(() => HumanConnection, { description: "Friends for this human." })
    public async friends(
        @Root() human: Human,
    ): Promise<HumanConnection> {
        const friends = this.friendsFetcher(human.id).sort((a, b) => parseInt(a.id, 10) < parseInt(b.id, 10) ? -1 : 1);
        const edges = friends.map((f) => ({
            node: f,
            cursor: `cursor,${f.id}`,
        }));
        const pageInfo = {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: `cursor,${friends[0].id}`,
            endCursor: `cursor,${friends[friends.length - 1].id}`,
        };
        return {
            edges,
            pageInfo,
        };
    }

    private humanFetcher(id: string) {
        return this.humanData.find((hd) => hd.id === id);
    }

    private clothesFetcher(id: string) {
        return this.clothData.filter((c) => c.human.includes(id))
            .map((c) => ({
                type: c.clothType,
                size: c.clothSize,
                color: c.color,
            }));
    }

    private friendsFetcher(id: string) {
        const targetHuman = this.humanData.find((h) => h.id === id)!;
        return targetHuman.friends.map((fid) => this.humanData.find((h) => h.id === fid)!)
            .map((h) => ({
                id: h.id,
                age: h.age,
                name: h.name,
            }));
    }
}
