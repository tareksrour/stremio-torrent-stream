import { TorrentSearchResult } from "./search.js";
import axios from "axios";
 const unitMultipliers = {
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
  };
export const searchTorrentio = async (
    id: string,
    type: string
  ): Promise<TorrentSearchResult[]> => {
    const url = `https://torrentio.elfhosted.com/stream/${type}/${id}.json`;
    const resp= await axios.get(url);
    const data = resp.data;
    return data?.streams?.map((torrent: any) => {
        const match = torrent.title.match(/💾 ([\d.]+) (KB|MB|GB)/);
        const users = 1 //parseInt(match[1], 10);
        const size = parseFloat(match[1]);
        const unit = match[2];
        return {
            name: torrent.title.split("💾")[0].trim(),
            tracker: "Torrentio",
            seeds: users,
            size: size * unitMultipliers[unit],
            magnet: torrent.infoHash,
        }
    });
  };