import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteBrandModal from "@/components/DeleteBrandModal";
import { Spinner } from "@/components/ui/spinner";

import brandApi, { BrandData } from "@/api/brand.api";
import { useDebounceValue } from "@/hooks/useDebounceValue";

const ManageBrandsPage = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<BrandData | null>(null);
  const [deletingBrand, setDeletingBrand] = useState(false);

  // Use our custom debounce hook with 500ms delay
  const [debouncedSearchTerms, setSearchTerms] = useDebounceValue("", 500);

  // Function to load brands with pagination and search
  const loadBrands = async (page: number, search: string) => {
    setLoading(true);
    try {
      const data = await brandApi.getAllBrands(page, 10, search);
      setBrands(data.brands);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      toast.error("Failed to load brands");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and reload when page or debounced search changes
  useEffect(() => {
    loadBrands(currentPage, debouncedSearchTerms);
  }, [currentPage, debouncedSearchTerms]);

  // Handle search input - sets the searchTerm but API call is triggered by the debounced value
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSearchTerms(e.target.value);
    // When search term changes, reset to first page
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  // ... rest of the component remains the same ...
  const handleEditBrand = (brandId: string) => {
    navigate(`/admin/brands/${brandId}`);
  };

  const handleDeleteClick = (brand: BrandData) => {
    setBrandToDelete(brand);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!brandToDelete) return;
    setDeletingBrand(true);

    try {
      await brandApi.deleteBrand(brandToDelete.id);
      toast.success(`Brand "${brandToDelete.brandName}" deleted successfully`);
      // Reload the current page to update the list
      loadBrands(currentPage, debouncedSearchTerms);
    } catch (error) {
      toast.error(
        error.response?.data?.errors?.[0]?.message || "Failed to delete brand"
      );
    } finally {
      setDeletingBrand(false);
      setDeleteModalOpen(false);
      setBrandToDelete(null);
    }
  };

  const renderPaginationItems = () => {
    // ... existing pagination rendering code ...
    const items = [];

    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    // ... existing JSX remains the same ...
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Brands</h1>
        <Button onClick={() => navigate("/admin/brands/add")}>
          <Plus className="mr-2 h-4 w-4" /> Add New Brand
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search brands..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <Table>
            <TableCaption>A list of all brands</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Brand Name</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No brands found
                  </TableCell>
                </TableRow>
              ) : (
                brands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell className="font-medium">
                      {brand.brandName}
                    </TableCell>
                    <TableCell>
                      {new Date(brand.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditBrand(brand.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(brand)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {brandToDelete && (
        <DeleteBrandModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          brandName={brandToDelete.brandName}
          isLoading={deletingBrand}
        />
      )}
    </div>
  );
};

export default ManageBrandsPage;
