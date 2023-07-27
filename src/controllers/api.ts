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
    await client.set(`LOOKUP:${username}`, xpubkh);

    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false });
  }
});

router.get("/.well-known/nostr.json", async (req: Request, res: Response) => {
  try {
    const username: string = req.query.username as string;

    if (!username) {
      return res.status(400).send({ success: false, error: "No username" });
    }

    const client = redisClient();

    const xpubkh: string | null = await client.get(`LOOKUP:${username}`);
    if (!xpubkh) {
      return res
        .status(400)
        .send({ success: false, error: "Username not found!" });
    }
    const resp = await nostr(xpubkh);
    const newResp = {
      names: {
        [username]: resp.names[xpubkh],
      },
    };

    return res.json(newResp);
  } catch (error) {
    res.status(500).send({ success: false });
  }
});

router.get(
  "/.well-known/lnurlp/:username",
  async (req: Request, res: Response) => {
    try {
      const username: string = req.params.username as string;

      if (!username) {
        return res.status(400).send({ success: false, error: "No username" });
      }
      const client = redisClient();
      const xpubkh: string | null = await client.get(`LOOKUP:${username}`);
      if (!xpubkh) {
        return res
          .status(400)
          .send({ success: false, error: "Username not found!" });
      }
      const resp = await lnurlp(xpubkh);

      resp.callback = `https://bitmask.app/api/pay/${username}`;
      resp.metadata = `[[\"text/plain\",\"Paid to ${username}@bitmask.app\"]]`;

      return res.json(resp);
    } catch (error) {
      res.status(500).send({ success: false });
    }
  }
);

router.get("/pay/:username", async (req: Request, res: Response) => {
  try {
    const username: string = req.params.username as string;
    const amount: number = parseInt(req.query.amount as string);

    if (!username) {
      return res.status(400).send({ success: false, error: "No username" });
    }

    if (!username) {
      return res.status(400).send({ success: false, error: "No amount" });
    }
    const client = redisClient();
    const xpubkh: string | null = await client.get(`LOOKUP:${username}`);
    if (!xpubkh) {
      return res
        .status(400)
        .send({ success: false, error: "Username not found!" });
    }
    const resp = await pay(username, amount);
    console.log(resp);

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

const pay = async (username: string, amount: number) => {
  try {
    const r = await axios.get(
      process.env.LNDHUBX_URL + `/pay/${username}?amount=${amount}`
    );

    return r.data;
  } catch (error) {
    console.error(error);

    return false;
  }
};

export default router;
