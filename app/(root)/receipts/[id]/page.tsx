"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { GET_SINGLE_RECEIPT_QUERY } from "@/lib/graphql/queries";
import { Receipt } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Calendar, Tag, AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";

const formatDate = (timestamp: string) => {
  if (!timestamp) return "N/A";
  return new Date(parseInt(timestamp, 10)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const DetailPageSkeleton = () => (
  <Card className="w-full max-w-2xl mx-auto pl-20">
    <CardHeader>
      <Skeleton className="h-8 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-24" />
    </CardFooter>
  </Card>
);

export default function ReceiptDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, loading, error } = useQuery(GET_SINGLE_RECEIPT_QUERY, {
    variables: { id },
  });

  if (loading)
    return (
      <div className="p-10">
        <DetailPageSkeleton />
      </div>
    );
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="w-full max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const receipt: Receipt | null = data?.receipt?.receipt;

  if (!receipt) return <div>Receipt not found.</div>;

  return (
    <div className="container mx-auto py-10 pl-20">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {receipt.storeName}
          </CardTitle>
          <CardDescription className="text-2xl font-semibold text-primary">
            ${receipt.totalAmount.toFixed(2)}
          </CardDescription>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />{" "}
              {formatDate(receipt.dateOfPurchase)}
            </div>
            <div className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" /> {receipt.category}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="mb-4 text-lg font-semibold">Purchased Items</h3>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipt.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">
                      ${item.price.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline">
            <Link href="/receipts">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Receipts
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
