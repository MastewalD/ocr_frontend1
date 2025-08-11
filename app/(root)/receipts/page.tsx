"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { GET_RECEIPTS_QUERY } from "@/lib/graphql/queries";
import { ReceiptsData } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

const formatDate = (timestamp: string) => {
  if (!timestamp) return "N/A";
  return new Date(parseInt(timestamp, 10)).toLocaleDateString();
};

const CATEGORIES = [
  "Groceries",
  "Clothing & Apparel",
  "Electronics",
  "Dining",
  "Utilities",
  "Other",
];

const ReceiptsLoadingSkeleton = () => (
  <div className="space-y-2 pl-20">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 border-b">
        <div className="space-y-2 flex-grow">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
    ))}
  </div>
);

export default function ReceiptsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_RECEIPTS_QUERY, {
    variables: {
      page: currentPage,
      limit: 10,
      category: categoryFilter,
    },
    notifyOnNetworkStatusChange: true,
  });

  const handleCategoryChange = (newCategory: string) => {
    const filterValue = newCategory === "all" ? null : newCategory;
    setCategoryFilter(filterValue);
    setCurrentPage(1);
    refetch({ page: 1, limit: 10, category: filterValue });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    refetch({ page: newPage, limit: 10, category: categoryFilter });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="w-full max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Fetching Receipts</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const responseData: ReceiptsData | null = data?.receipts?.data;

  return (
    <div className="container mx-auto py-10 pl-20">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText />
            My Receipts
          </CardTitle>
          <div className="w-[200px]">
            <Select onValueChange={handleCategoryChange} defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ReceiptsLoadingSkeleton />
          ) : (
            <>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Store</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responseData?.receipts.length ? (
                      responseData.receipts.map((receipt) => (
                        <TableRow key={receipt.id}>
                          <TableCell className="font-medium">
                            {receipt.storeName}
                          </TableCell>
                          <TableCell>{receipt.category}</TableCell>
                          <TableCell>
                            {formatDate(receipt.dateOfPurchase)}
                          </TableCell>
                          <TableCell className="text-right">
                            ${receipt.totalAmount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/receipts/${receipt.id}`}>View</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">
                          No receipts found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {responseData && responseData.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    variant="outline"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                  </Button>
                  <span className="text-sm font-medium">
                    Page {currentPage} of {responseData.totalPages || 1}
                  </span>
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= (responseData.totalPages || 1)}
                    variant="outline"
                  >
                    Next <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
