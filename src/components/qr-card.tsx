import Image from "next/image";
import QRCode from "qrcode";

export async function QrCard({ url }: { url: string }) {
  const dataUrl = await QRCode.toDataURL(url, {
    margin: 1,
    color: {
      dark: "#1c1917",
      light: "#fffaf2",
    },
    width: 280,
  });

  return (
    <div className="rounded-[1.75rem] border border-stone-200 bg-[linear-gradient(180deg,#fffdf8_0%,#f8f1e6_100%)] p-4 shadow-[0_14px_34px_rgba(77,58,39,0.08)]">
      <Image
        src={dataUrl}
        alt="QR de votacion"
        width={280}
        height={280}
        className="mx-auto h-48 w-48 rounded-2xl border border-white bg-white p-2 shadow-sm"
      />
      <p className="mt-3 break-all text-center text-xs text-stone-600">{url}</p>
    </div>
  );
}
