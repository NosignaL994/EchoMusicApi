import Router from "@koa/router";
import {
  completeListSongMeta,
  getSrcComplement,
  isSource,
  isStr,
} from "@/common/utils";
import { ERROR_MSG } from "@/common/constant";
import { queryAlbumDetail } from "@/feature";

const router = new Router();
router.get("/detail", async (ctx, next) => {
  // await next();
  const { id, src } = ctx.query;
  if (!isStr(id) || !isStr(src) || !isSource(src))
    throw new Error(ERROR_MSG.ParamError);
  const res = await queryAlbumDetail[src](id);
  res.songlist = await completeListSongMeta(
    res.songlist,
    getSrcComplement(src)
  );
  const body = JSON.stringify(res);
  ctx.status = 200;
  ctx.body = body;
});

export default router;
