import {
  Asset,
  BASE_FEE,
  Horizon,
  Keypair,
  Memo,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { NextRequest, NextResponse } from "next/server";

const HORIZON_TESTNET_URL = "https://horizon-testnet.stellar.org";
const FRIENDBOT_URL = "https://friendbot.stellar.org";

const server = new Horizon.Server(HORIZON_TESTNET_URL);

export async function POST(request: NextRequest) {
  const body = await request.json();
  const hash: string | undefined = body?.hash;

  if (!hash || !/^[0-9a-f]{64}$/i.test(hash)) {
    return NextResponse.json(
      { error: "hash debe ser un SHA-256 hexadecimal de 64 caracteres" },
      { status: 400 },
    );
  }

  try {
    const keypair = Keypair.random();

    const friendbotRes = await fetch(
      `${FRIENDBOT_URL}/?addr=${keypair.publicKey()}`,
    );
    if (!friendbotRes.ok) {
      throw new Error("No se pudo fondear la cuenta en Friendbot");
    }

    const account = await server.loadAccount(keypair.publicKey());

    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: keypair.publicKey(),
          asset: Asset.native(),
          amount: "0.0000001",
        }),
      )
      .addMemo(Memo.hash(Buffer.from(hash, "hex")))
      .setTimeout(180)
      .build();

    transaction.sign(keypair);

    const result = await server.submitTransaction(transaction);

    return NextResponse.json({
      txHash: result.hash,
      explorerUrl: `https://stellar.expert/explorer/testnet/tx/${result.hash}`,
    });
  } catch (error) {
    console.error("Error registrando hash en Stellar:", error);
    return NextResponse.json(
      { error: "No se pudo registrar el hash en la blockchain" },
      { status: 502 },
    );
  }
}
