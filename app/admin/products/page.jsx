"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { ProductsEmptyState } from "@/components/ui/empty-state";
import useSWR from "swr";

// Mock products data (replace with actual API calls)
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ProductsAdmin() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");

  // Include page and filters in the API URL
  const apiUrl = `/api/admin/products?page=${page}&limit=10${
    searchQuery ? `&search=${searchQuery}` : ""
  }${category ? `&category=${category}` : ""}`;
  const { data, error, mutate } = useSWR(apiUrl, fetcher);

  // Extract products and pagination from the response
  const products = data?.products || [];
  const pagination = data?.pagination || { total: 0, pages: 1 };

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load products. Please try again.",
      });
      setLoading(false);
    } else if (data) {
      setLoading(false);
    }
  }, [data, error, toast]);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      // Actual delete API call
      const response = await fetch(
        `/api/admin/products?id=${productToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Refresh the product list after deletion
      mutate();

      toast({
        title: "Product deleted",
        description: `${productToDelete.name} has been removed.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product. Please try again.",
      });
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">In Stock</Badge>;
      case "low-stock":
        return <Badge className="bg-amber-500">Low Stock</Badge>;
      case "out-of-stock":
        return <Badge className="bg-red-500">Out of Stock</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Button asChild>
          <Link href="/admin/products/new">Add New Product</Link>
        </Button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Search bar */}
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        {/* Category filter */}
        <div className="w-full md:w-56">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-10 px-3 py-2 bg-background border rounded-md"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home & Kitchen</option>
            <option value="sports">Sports & Outdoors</option>
            <option value="beauty">Beauty & Personal Care</option>
            <option value="books">Books</option>
            <option value="toys">Toys & Games</option>
          </select>
        </div>

        {/* Search button */}
        <Button
          onClick={() => {
            // Reset to first page when searching
            setPage(1);
            mutate();
          }}
        >
          Search
        </Button>
      </div>

      {loading ? (
        <ProductsEmptyState isAdmin={true} isLoading={true} />
      ) : !products || products.length === 0 ? (
        <ProductsEmptyState isAdmin={true} />
      ) : (
        <div className="bg-card rounded-lg shadow overflow-hidden border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products &&
                products.length > 0 &&
                products.map((product) => (
                  <TableRow key={product._id || product.id}>
                    <TableCell>
                      <div className="h-12 w-12 bg-muted rounded flex items-center justify-center overflow-hidden">
                        {product.mainImage ? (
                          <img
                            src={product.mainImage}
                            alt={product.name || "Product"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            No image
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name || "Unnamed Product"}
                    </TableCell>
                    <TableCell>
                      {product.categories && product.categories.length > 0
                        ? product.categories[0]
                        : "Uncategorized"}
                    </TableCell>
                    <TableCell className="text-right">
                      ${parseFloat(product.price || 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      {product.stock || 0}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(
                        product.stock && product.stock > 0
                          ? "active"
                          : "out-of-stock"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/admin/products/edit/${
                              product.slug || product._id || product.id
                            }`}
                          >
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(product)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {!loading && products && products.length > 0 && pagination && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {products.length} of {pagination.total} products
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>

            {/* Page numbers */}
            <div className="flex gap-1 mx-2">
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              {pagination.pages > 5 && (
                <>
                  <Button variant="outline" size="sm" disabled>
                    ...
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(pagination.pages)}
                  >
                    {pagination.pages}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(pagination.pages, page + 1))}
              disabled={page === pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{productToDelete?.name}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
