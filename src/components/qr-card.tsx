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
    <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
      <Image
        src={dataUrl}
        alt="QR de votacion"
        width={280}
        height={280}
        className="mx-auto h-48 w-48 rounded-2xl"
      />
      <p className="mt-3 break-all text-center text-xs text-stone-600">{url}</p>
    </div>
  );
}
