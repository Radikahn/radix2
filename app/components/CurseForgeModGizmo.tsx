'use-client';
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const CURSE_FORGE_API_KEY = process.env.CURSE_FORGE_API_KEY;
const CURSE_FORGE_API = "https://api.curseforge.com";

const COMMON_PARAMETERS = {
  classId: 6,
  gameId: 432,
  gameVersion: "1.20.1",
  modLoaderType: 1,
  pageSize: 50,
  sortField: 6,
};

type ModsQueryKey = [key: "mods", search: string, index: number];

type SearchModsItem = {
  id?: number;
  name?: string;
  slug?: string;
  summary?: string;
  logo?: SearchModsItemLogo;
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
        "x-api-key": CURSE_FORGE_API_KEY!!!!!,
      },
    }
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
  return (
    <li className="flex" key={key}>
      <img className="size-full" src={item.logo!!!!!.url} />
      <div className="flex flex-col">
        <p className="text-lg">{item.name}</p>
        <p className="text-xs">{item.summary}</p>
      </div>
    </li>
  );
};

export const CurseForgeModGizmo = () => {
  const [search, setSearch] = useState("");
  const [index, setIndex] = useState(0);

  const mods = useQuery({
    queryKey: ["mods", search, index],
    queryFn: getMods,
  });

  if (!mods.isSuccess) {
    return <h1>xD</h1>;
  }

  return (
    <ol>
      {mods.data.data.map((item, index) => (
        <SearchModsItemElement key={index} item={item} />
      ))}
    </ol>
  );
};
