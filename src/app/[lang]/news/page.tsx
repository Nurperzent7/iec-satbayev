import { Metadata } from "next";
import Link from "next/link";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getNewsData } from "@/lib/server-utils";

export const metadata: Metadata = {
  title: "Satbayev University News",
  description: "Satbayev University news",
  openGraph: {
    title: "Satbayev University News",
    description: "Satbayev University news",
  },
  twitter: {
    title: "Satbayev University News",
    description: "Satbayev University news",
  },
};

export default async function NewsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang }: { lang: string } = await params;
  const posts = await getNewsData(lang);
  return <>
    <div className="h-full">
      <div className="px-4 md:px-0 mt-32 pb-48 grid grid-cols-1 gap-4 md:w-[1200px] w-full md:grid-cols-3 mx-auto">
        {posts.map((post, index) => (
          <Link href={`/${lang}/news/${post.slug}`} key={index}>
            <Card key={index} className="overflow-hidden h-[400px]">
              {post.imagePath && <img src={post.imagePath} alt={post.title} width={400} height={180} className="object-cover mx-auto" />}
              <CardHeader>
                <CardTitle>
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardFooter>
                <p className="text-secondary-foreground">
                  {post.date}
                </p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  </>;
}
