import axios from "axios";
import { Request, Response, Router } from "express";

import redisClient from "../../redis";

const router = Router();

router.post("/username", async (req: Request, res: Response) => {
  try {
    const username: string = req.body.username as string;
    const xpubkh: string = req.body.xpubkh as string;

    if (!username) {
      return res.status(400).send({ success: false, error: "No username" });
    }

    if (!xpubkh) {
      return res.status(400).send({ success: false, error: "No xpubkh" });
    }

    const client = redisClient();
    client.connect();
    await client.set(`LOOKUP:${username}`, xpubkh);

    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false });
  }
});

router.get("/nostr.json", async (req: Request, res: Response) => {
  try {
    const username: string = req.query.username as string;

    if (!username) {
      return res.status(400).send({ success: false, error: "No username" });
    }

    const resp = await nostr(username);
    const client = redisClient();
    client.connect();
    const lookup = await client.get(`LOOKUP:${username}`);
    console.log(lookup);

    return res.json(resp);
  } catch (error) {
    res.status(500).send({ success: false });
  }
});

router.get("/lnurlp/:username", async (req: Request, res: Response) => {
  try {
    const username: string = req.params.username as string;

    if (!username) {
      return res.status(400).send({ success: false, error: "No username" });
    }

    const client = redisClient();
    client.connect();
    const lookup = await client.get(`LOOKUP:${username}`);
    console.log(lookup);
    const resp = await lnurlp(username);

    return res.json(resp);
  } catch (error) {
    res.status(500).send({ success: false });
  }
});

const lnurlp = async (username: string) => {
  try {
    const r = await axios.get(
      process.env.LNDHUBX_URL + `/.well-known/lnurlp/${username}`
    );

    return r.data;
  } catch (error) {
    console.error(error);

    return false;
  }
};

const nostr = async (username: string) => {
  try {
    const r = await axios.get(
      process.env.LNDHUBX_URL + `/.well-known/nostr.json?name=${username}`
    );

    return r.data;
  } catch (error) {
    console.error(error);

    return false;
  }
};

export default router;
