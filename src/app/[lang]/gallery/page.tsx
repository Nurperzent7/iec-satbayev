import { getGalleryPaths, getStrings } from "@/lib/server-utils";
import ImageCarousel from "@/components/image-carousel";

export default async function GalleryPage({
    params
}: {
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params;
    const galleryPaths = await getGalleryPaths();
    const strings = await getStrings(lang);

    // Ensure we have a string for the alt attribute
    const galleryTitle = typeof strings.navbarItemGallery === 'string'
        ? strings.navbarItemGallery
        : 'Галерея';

    return <div>
        <h1>{galleryTitle}</h1>
        <ImageCarousel images={galleryPaths} alt={galleryTitle} />
    </div>;
}