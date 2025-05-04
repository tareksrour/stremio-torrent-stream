import { TorrentSearchResult } from "./search.js";
import axios from "axios";
const proxy = process.env.SOCKS_PROXY;
import { SocksProxyAgent } from "socks-proxy-agent"
if (proxy) {
  const agent = new SocksProxyAgent(proxy);
  axios.defaults.httpAgent = agent;
  axios.defaults.httpsAgent = agent;
  axios.defaults.proxy = false;
}
 const unitMultipliers = {
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
  };
export const searchTorrentio = async (
    id: string,
    type: string
  ): Promise<TorrentSearchResult[]> => {
    const url = `https://torrentio.strem.fun/stream/${type}/${id}.json`;
    const resp= await axios.get(url);
    const data = resp.data;
    return data?.streams?.map((torrent: any) => {
        const match = torrent.title.match(/👤 ([\d.]+) 💾 ([\d.]+) (KB|MB|GB)/);
        const users = parseInt(match[1], 10);
        const size = parseFloat(match[2]);
        const unit = match[3];
        return {
            name: torrent.title.split("\n👤")[0].trim(),
            tracker: "Torrentio",
            seeds: users,
            size: size * unitMultipliers[unit],
            magnet: torrent.infoHash,
        }
    });
  };