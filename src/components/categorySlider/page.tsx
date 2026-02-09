import useProducts from "@/app/hooks/useProducts";
import { fromUrlFormat, toUrlFormat } from "@/app/lib/urlFormatter";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

export function CategorySlider() {
  const { products } = useProducts();
  console.log(products);
  const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));
  return (
    <>
      <div className="w-10/12 m-auto">
        <Carousel className="w-full ">
          <CarouselContent className="-ml-1">
            {Array.from({ length: uniqueCategories.length }).map((_, index) => (
              <CarouselItem
                key={uniqueCategories[index]}
                className="basis-1/2  lg:basis-1/4"
              >
                <div className="p-3 text-center">
                  <Link
                    className="box-bg"
                    href={`/products/${toUrlFormat(uniqueCategories[index])}`}
                  >
                    {uniqueCategories[index]}
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  );
}

export default CategorySlider;
