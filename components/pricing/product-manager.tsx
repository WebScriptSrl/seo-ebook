"use client";

import * as React from "react";
import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Product } from "@prisma/client";

import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Icons } from "@/components//shared/icons";
import { Badge } from "@/components//ui/badge";
import { Separator } from "@/components//ui/separator";

import { useDeleteProductModal } from "../modals/delete-products-modal";
import { SelectProductType } from "../shared/select-type";

export interface IProduct extends Product {
  _count: {
    reviews: number;
    orders: number;
  };
}

interface ProductInfoProps extends React.HTMLAttributes<HTMLFormElement> {
  products: IProduct[] | null;
  pathname: string;
  productsCount: number | null;
}

export function AdminProductsInfo(
  { products, productsCount }: ProductInfoProps,
  pathname: string,
) {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") || "all";

  const {
    setPath,
    productsIds,
    setProductsIds,
    setShowDeleteProductModal,
    DeleteProductModal,
  } = useDeleteProductModal();

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [editProduct, setEditProduct] = useState<IProduct>();

  useEffect(() => {
    setSelectedProducts(productsIds);
  }, [productsIds, setProductsIds]);

  const navToState = useCallback(
    (newPageState: string) => {
      const key = "type";
      const newSearchParams = new URLSearchParams(searchParams || undefined);
      newSearchParams.set(key, String(newPageState));
      newSearchParams.delete("page"); // Clear the page number when changing page state
      router.push(`${path}?${newSearchParams.toString()}`);
    },
    [searchParams, path, router],
  );

  return (
    <Suspense
      fallback={
        <Skeleton className="hidden h-16 w-full rounded-full lg:flex" />
      }
    >
      {products && products.length > 0 ? (
        <>
          <DeleteProductModal />
          <Card>
            <CardHeader>
              <CardTitle>
                Your{" "}
                <span className="text-gradient_cyan-red capitalize">
                  {currentType !== "all" ? currentType : ""}
                </span>{" "}
                {products.length === 1 ? "Product" : "Products"}
              </CardTitle>
              <CardDescription>
                You have{" "}
                <span className="text-gradient_cyan-red">
                  {" "}
                  a total of {productsCount}
                </span>{" "}
                {products.length === 1 ? "product" : "products"}.
              </CardDescription>

              <Separator />

              <SelectProductType
                type={currentType}
                setType={navToState}
                options={["all", "direct", "amazon"]}
                side="top"
              />
            </CardHeader>
            <CardContent>
              <ToggleGroup
                type="multiple"
                variant="outline"
                className="flex flex-col space-y-4"
                onValueChange={(value) => {
                  setSelectedProducts(value);
                }}
              >
                {products.map((item: IProduct) => (
                  <ToggleGroupItem
                    key={item.id}
                    value={item.id}
                    className="flex size-full flex-col gap-5 p-4"
                  >
                    <div className="flex w-full flex-wrap items-center justify-between">
                      <Badge
                        variant="outline"
                        className={cn(
                          selectedProducts.includes(item.id)
                            ? "text-gradient_indigo-purple"
                            : "text-gradient_cyan-red",
                        )}
                      >
                        {selectedProducts.includes(item.id)
                          ? "Selected"
                          : `${item.title}`}
                      </Badge>

                      <Badge
                        variant="outline"
                        className={cn("text-gradient_cyan-red")}
                      >
                        {`${item.currency ? item.currency : "USD"} ${item.price}`}
                      </Badge>

                      <Badge
                        variant="outline"
                        className={cn(
                          item.discount
                            ? "text-gradient_cyan-red"
                            : "text-gradient_indigo-purple",
                        )}
                      >
                        {item.discount
                          ? `${item.currency ? item.currency : "USD"} ${item.discount} discount`
                          : "No discount"}
                      </Badge>

                      <Badge
                        variant="outline"
                        className={cn(
                          "text-gradient_cyan-red",
                          item._count.reviews > 0
                            ? "cursor-pointer"
                            : "cursor-not-allowed",
                        )}
                      >
                        {item._count.reviews}{" "}
                        {item._count.reviews === 1 ? "Review" : "Reviews"}
                      </Badge>
                    </div>

                    <div className="flex w-full flex-col md:flex-row md:gap-5">
                      <span className="text-xs text-muted-foreground">
                        Title:
                      </span>{" "}
                      <p className="text-sm">
                        {item.title},{" "}
                        <span className="text-xs italic text-muted-foreground">
                          Internal name: {item.name}
                        </span>
                      </p>
                    </div>

                    {item.stripePriceId && (
                      <div className="flex w-full flex-col md:flex-row md:gap-5">
                        <span className="text-xs text-muted-foreground">
                          Price ID:
                        </span>{" "}
                        <p className="text-sm">
                          <span className="text-xs italic text-muted-foreground">
                            {item.stripePriceId}
                          </span>
                        </p>
                      </div>
                    )}

                    {item.stripePromoCode && (
                      <div className="flex w-full flex-col md:flex-row md:gap-5">
                        <span className="text-xs text-muted-foreground">
                          Discount:
                        </span>{" "}
                        <p className="text-xs italic">
                          {item.stripePromoCode},{" "}
                          <span className="text-xs text-muted-foreground">
                            {item.discount}
                          </span>
                        </p>
                      </div>
                    )}

                    {item.description && (
                      <div className="flex w-full flex-col md:flex-row md:gap-5">
                        <span className="text-xs text-muted-foreground">
                          Description:
                        </span>{" "}
                        <q className="text-sm italic">{item.description}</q>
                      </div>
                    )}

                    {item.key && (
                      <div className="flex w-full flex-col md:flex-row md:gap-5">
                        <span className="text-xs text-muted-foreground">
                          Key:
                        </span>{" "}
                        <span className="text-xs text-muted-foreground">
                          {item.key}
                        </span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex min-h-min w-full flex-col items-center gap-3 md:flex-row md:justify-between md:gap-5">
                      <p className="text-sm text-muted-foreground">
                        <span className="text-xs text-muted-foreground">
                          Added on:
                        </span>{" "}
                        {formatDate(item.createdAt.toDateString())}
                      </p>

                      {selectedProducts.includes(item.id) && (
                        <div
                          className="flex items-center gap-5 text-muted-foreground"
                          aria-label="Edit or delete review"
                        >
                          <Icons.trash
                            className="cursor-pointer hover:scale-110 hover:stroke-red-500"
                            size={20}
                            onClick={() => {
                              setProductsIds([item.id]);
                              setPath(pathname);
                              setShowDeleteProductModal(true);
                            }}
                          />

                          <Icons.edit
                            className="cursor-pointer hover:scale-110 hover:stroke-cyan-500"
                            size={20}
                            onClick={() => {
                              setEditProduct(item);
                            }}
                          />
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground">
                        <span className="text-xs text-muted-foreground">
                          Last updated on:
                        </span>{" "}
                        {formatDate(item.updatedAt.toDateString())}
                      </p>
                    </div>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </CardContent>
            <CardFooter className="flex flex-col items-center space-y-2 border-t bg-accent py-2 md:flex-row md:justify-end md:space-y-0">
              {selectedProducts.length > 0 ? (
                <Button
                  variant={"destructive"}
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setProductsIds(selectedProducts);
                    setPath(pathname);
                    setShowDeleteProductModal(true);
                  }}
                >
                  Delete{" "}
                  {selectedProducts.length > 0 ? selectedProducts.length : ""}{" "}
                  {selectedProducts.length === 1 ? "product" : "products"}
                </Button>
              ) : (
                <div className="flex w-full items-center justify-center md:justify-between">
                  <p className="hidden text-sm text-muted-foreground md:block">
                    Select a product to delete or edit
                  </p>
                </div>
              )}
            </CardFooter>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              You have no {currentType !== "all" ? currentType : ""} products
              yet !
            </CardTitle>
            <CardDescription>
              Check out our{" "}
              <span className="text-primary">SEO.eBook guide</span> on how to
              launch your first product.
            </CardDescription>
            <Separator />
            <SelectProductType
              type={currentType}
              setType={navToState}
              options={["all", "direct", "amazon"]}
              side="top"
            />
          </CardHeader>
          <CardFooter className="flex flex-col items-center space-y-2 border-t bg-accent py-2 md:flex-row md:justify-between md:space-y-0">
            <Link href={"/guides"}>
              <Button>Check out our guides</Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </Suspense>
  );
}
