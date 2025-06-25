import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const headersList = await headers();
  const locale = headersList.get('accept-language')?.split(',')[0]?.split('-')[0]
  redirect(`/${locale}`)
}
