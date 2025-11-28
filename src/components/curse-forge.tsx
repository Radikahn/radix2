import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { getToastGif } from "../lib/gifs";

const CURSE_FORGE_API_KEY = import.meta.env.VITE_CURSE_FORGE_API_KEY;
const CURSE_FORGE_API = "https://api.curseforge.com";

const COMMON_PARAMETERS = {
    gameId: 432, // Minecraft.
    gameVersion: "1.20.1",
    modLoaderType: 1,
    pageSize: 50,
    sortField: 6,
    sortOrder: "desc",
};

type ModsQueryKey = [key: "mods", search: string, index: number];

type SearchModsItem = {
    id: number;
    name: string;
    slug?: string;
    summary?: string;
    links: SearchModsLinks;
    logo?: SearchModsItemLogo;
};

type SearchModsLinks = {
    websiteUrl: string;
};

type SearchModsItemLogo = {
    url: string;
};

type SearchModsPagination = {
    index: number;
    pageSize: number;
    resultCount: number;
    totalCount: number;
};

const getMods = async ({ queryKey }: { queryKey: ModsQueryKey }) => {
    const parameters = new URLSearchParams({
        searchFilter: queryKey[1],
        index: queryKey[2].toString(),
        ...(COMMON_PARAMETERS as unknown as Record<string, string>),
    });

    const response = await fetch(
        `${CURSE_FORGE_API}/v1/mods/search?${parameters.toString()}`,
        {
            headers: {
                Accept: "application/json",
                "x-api-key": CURSE_FORGE_API_KEY,
            },
        },
    );

    return (await response.json()) as {
        data: SearchModsItem[];
        pagination: SearchModsPagination;
    };
};

const SearchModsItemElement = ({
    key,
    item,
}: {
    key: number;
    item: SearchModsItem;
}) => {
    const suggestModMutation = useMutation({
        mutationFn: async () => {
            await fetch("https://pack.radikahn.com/mod/suggest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: item.name,
                    url: item.links.websiteUrl,
                    image: item.logo!.url,
                }),
            });
        },
        onSuccess: () => {
            toast(
                <div className="flex items-center gap-x-2">
                    <img className="h-16 rounded-lg" src={getToastGif()} />

                    <p>Suggested {item.name}!</p>
                </div>,
                {
                    toastId: item.id,
                    hideProgressBar: true,
                    closeButton: false,
                },
            );
        },
    });

    return (
        <li className="relative flex gap-x-2 border shadow-xl" key={key}>
            <img
                className="h-24 border-r bg-neutral-300"
                src={
                    item.logo?.url ??
                    "https://media1.tenor.com/m/3gr9u8zdTzUAAAAd/cat-loading-hgb.gif"
                }
            />

            <div className="flex flex-col">
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-xs">{item.summary}</p>
            </div>

            <div className="absolute flex p-2 size-full items-end justify-end">
                <button
                    className="border py-1 px-2 hover:bg-blue-200 cursor-pointer"
                    onClick={() => {
                        suggestModMutation.mutate();
                    }}
                >
                    Suggest
                </button>
            </div>
        </li>
    );
};

const CurseForgeResults = ({
    search,
    index,
}: {
    search: string;
    index: number;
}) => {
    const mods = useQuery({
        queryKey: ["mods", search, index],
        queryFn: getMods,
    });

    if (!mods.isSuccess) {
        return <h1>xD</h1>;
    }

    return (
        <ol className="flex flex-col gap-y-2">
            {mods.data.data.map((item, index) => (
                <SearchModsItemElement key={index} item={item} />
            ))}
        </ol>
    );
};

export const CurseForgeFinder = () => {
    const [search, setSearch] = useState("");

    return (
        <div className="size-full flex flex-col gap-y-2 items-center justify-center">
            <h1 className="text-2xl">Mods</h1>

            <input
                className="border px-2 w-full"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search..."
            />

            <CurseForgeResults index={0} search={search} />
        </div>
    );
};
