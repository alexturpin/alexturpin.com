import { randomBytes } from "node:crypto";
import { access, writeFile } from "node:fs/promises";
import { URL } from "node:url";

import { Secp256k1Keypair } from "@atproto/crypto";
import { hash } from "bcryptjs";

const destination = new URL("../.dev.vars", import.meta.url);
let exists = true;
try {
  await access(destination);
} catch (error) {
  if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") throw error;
  exists = false;
}

if (!exists) {
  const key = await Secp256k1Keypair.create({ exportable: true });
  const password = randomBytes(24).toString("hex");
  const values = {
    AUTH_TOKEN: randomBytes(32).toString("hex"),
    SIGNING_KEY: Buffer.from(await key.export()).toString("hex"),
    SIGNING_KEY_PUBLIC: key.did().replace("did:key:", ""),
    JWT_SECRET: randomBytes(32).toString("hex"),
    PASSWORD_HASH: await hash(password, 10),
    // Retained locally for testing login; Cirrus ignores this extra variable.
    LOCAL_TEST_PASSWORD: password,
  };
  await writeFile(
    destination,
    "# Disposable local credentials. Never upload these as production secrets.\n" +
      Object.entries(values)
        .map(([name, value]) => `${name}='${value}'`)
        .join("\n") +
      "\n",
    { mode: 0o600, flag: "wx" },
  );
  console.log("Created local PDS credentials in apps/pds/.dev.vars.");
}
