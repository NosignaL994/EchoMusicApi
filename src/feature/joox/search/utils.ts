import {
  SearchResponse as RawSearchResponse,
  ItemType,
  SearchTypeResponse as RawSearchTypeResponse,
} from "./typing";
import { SearchType, SearchData, SearchTypeData } from "@/common/typing/search";
import { Source } from "@/common/typing/common";

import { simplify } from "simplify-chinese";
import { convertImage } from "../common";
import { parseTimestamp } from "@/common/utils";

export function convertType(type: ItemType): SearchType;
export function convertType(type: SearchType): ItemType;

export function convertType(type: ItemType | SearchType) {
  switch (type) {
    case ItemType.album:
      return SearchType.album;
    case ItemType.songlist:
      return SearchType.songlist;
    case ItemType.album:
      return SearchType.song;
    // case ItemType.singer:
    //   return SearchType.singer;
    case SearchType.album:
      return ItemType.album;
    // case SearchType.singer:
    //   return ItemType.singer;
    case SearchType.song:
      return ItemType.song;
    case SearchType.songlist:
      return ItemType.songlist;
    default:
      throw "error 'type' value";
  }
}

export const serializeSearch = (data: RawSearchResponse): SearchData => {
  const sections = data.section_list;
  const res: SearchData = { src: Source.joox };
  for (const s of sections) {
    for (const item of s.item_list) {
      switch (item.type) {
        case ItemType.songlist: {
          if (res.songlist === undefined) {
            res.songlist = [];
          }
          res.songlist.push({
            id: item.editor_playlist.id,
            name: simplify(item.editor_playlist.name),
            pic: convertImage(item.editor_playlist.images),
          });
          break;
        }
        case ItemType.album: {
          if (res.album === undefined) {
            res.album = [];
          }
          res.album.push({
            id: item.album.id,
            name: simplify(item.album.name),
            pic: convertImage(item.album.images),
            singer: simplify(
              item.album.artist_list.map((a) => a.name).join(" | ")
            ),
          });
          break;
        }
        case ItemType.song: {
          if (res.song === undefined) {
            res.song = [];
          }
          res.song.push(
            ...item.song.map((i) => ({
              id: i.song_info.id,
              name: simplify(i.song_info.name),
              singer: simplify(
                i.song_info.artist_list.map((a) => a.name).join(" | ")
              ),
            }))
          );
          break;
        }
        // case ItemType.singer: {
        //   if (res.singer === undefined) {
        //     res.singer = [];
        //   }
        //   res.singer.push({
        //     id: item.singer.id,
        //     name: simplify(item.singer.name),
        //     pic: convertImage(item.singer.images),
        //   });
        //   break;
        // }
      }
    }
  }
  return res;
};

export const serializeSearchType = (
  data: RawSearchTypeResponse,
  type: SearchType
): SearchTypeData => {
  const res: SearchTypeData = {
    hasMore: false,
    data: [],
    type,
    // src: Source.joox,
    // page: 1,
    // sum: 0,
  };
  switch (res.type) {
    case SearchType.album: {
      if (data.albums) {
        res.data.push(
          ...data.albums.map((item) => ({
            name: simplify(item.name),
            singerName: item.artist_list.map((a) => a.id),
            publicTime: parseTimestamp(item.publish_date),
            [Source.joox]: {
              id: item.id,
              pic: convertImage(item.images),
              singerId: item.artist_list.map((a) => a.name),
            },
          }))
        );
        // res.sum = res.data.length;
      }
      break;
    }
    // case SearchType.singer: {
    //   if (data.artists) {
    //     res.data.push(
    //       ...data.artists.map((item) => ({
    //         name: simplify(item.name),
    //         [Source.joox]: {
    //           id: item.id,
    //           pic: convertImage(item.images),
    //         },
    //       }))
    //     );
    //     res.sum = res.data.length;
    //   }
    //   break;
    // }
    case SearchType.song: {
      if (data.tracks) {
        data.tracks.forEach((item) => {
          res.data.push(
            ...item.map((track) => ({
              name: simplify(track.name),
              singerName: track.artist_list.map((a) => a.name),
              albumName: track.album_name,
              duration: track.play_duration,
              [Source.joox]: {
                id: track.id,
                pic: convertImage(track.images),
                albumId: track.album_id,
                singerId: track.artist_list.map((a) => a.id),
              },
            }))
          );
        });
        // res.sum = res.data.length;
      }
      break;
    }
    case SearchType.songlist: {
      if (data.playlists) {
        res.data.push(
          ...data.playlists.map((item) => ({
            id: item.id,
            name: simplify(item.name),
            pic: convertImage(item.images),
          }))
        );
        // res.sum = res.data.length;
      }
      break;
    }
  }
  return res;
};
