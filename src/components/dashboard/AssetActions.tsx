"use client";

import { useState } from "react";
import { BuyTokensDialog } from "./BuyTokensDialog";
import { SellTokensDialog } from "./SellTokensDialog";
import type { Asset } from "@/types/ankora";

export function AssetActions({ asset }: { asset: Asset }) {
  const [buyOpen, setBuyOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setBuyOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#ddcfc9] px-4 py-2 text-sm font-semibold text-[#3a1410] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-white"
        >
          Comprar más tokens
        </button>
        <button
          onClick={() => setSellOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#ddcfc9]/20 px-4 py-2 text-sm font-medium text-[#ddcfc9] transition-colors hover:bg-[#ddcfc9]/[0.04]"
        >
          Vender en secundario
        </button>
      </div>

      <BuyTokensDialog asset={asset} open={buyOpen} onOpenChange={setBuyOpen} />
      <SellTokensDialog asset={asset} open={sellOpen} onOpenChange={setSellOpen} />
    </>
  );
}
