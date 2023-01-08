import { ToplistAllResponse, ToplistDetailResponse } from "./typing";
import { ToplistAll, ToplistDetail } from "@/common/typing/toplist";
import { parseTimestamp } from "@/common/utils";
import { serializeSongItemList } from "../song/utils";
export const serializeToplistAll = (data: ToplistAllResponse): ToplistAll => {
  const groups = data.req_0.data.group;
  return {
    groups: groups.map((group) => ({
      name: group.groupName,
      toplist: group.toplist.map((item) => ({
        id: item.topId,
        name: item.title,
        intro: item.intro,
        updateTime: parseTimestamp(item.updateTime),
        picUrl: item.frontPicUrl,
      })),
    })),
  };
};

export const serializeToplistDetail = (
  data: ToplistDetailResponse
): ToplistDetail => {
  const temp = data.req_1.data;
  return {
    id: temp.data.topId,
    name: temp.data.title,
    intro: temp.data.intro,
    updateTime: parseTimestamp(temp.data.updateTime),
    playCount: temp.data.listenNum,
    total: temp.data.totalNum,
    songlist: serializeSongItemList(temp.songInfoList),
  };
};
